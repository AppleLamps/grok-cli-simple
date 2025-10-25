const fs = require('fs').promises;
const path = require('path');
const open = require('open');
const { askQuestion } = require('../utils/prompt');
const { assertInsideWorkspace, validateSecurePath } = require('../utils/pathSecurity');

async function editCommand(input, context) {
  const fileName = input.slice(5).trim();

  if (!fileName) {
    context.ui.error('Please provide a filename. Usage: edit <file>');
    return;
  }

  // Validate and resolve path using secure helper
  let filePath;
  try {
    const resolvedBase = path.resolve(context.workingDirectory);
    const resolvedTarget = path.resolve(context.workingDirectory, fileName);
    filePath = assertInsideWorkspace(resolvedBase, resolvedTarget, 'edit');
    // Validate secure path (prevents symlink traversal)
    await validateSecurePath(filePath, context.workingDirectory, 'edit');
  } catch (error) {
    context.ui.error(`Security Error: ${error.message}`);
    return;
  }

  try {
    // Check if file exists
    const fileExists = await fs.access(filePath).then(() => true).catch(() => false);

    if (!fileExists) {
      context.ui.warning(`File "${fileName}" not found.`);
      const create = await askQuestion(context.rl, 'Would you like to create it? (y/n): ');

      if (!create.toLowerCase().startsWith('y')) {
        return;
      }
    }

    // Read existing content or start empty
    let content = '';
    if (fileExists) {
      content = await fs.readFile(filePath, 'utf8');
      console.log('');
      context.ui.header(`Current content: ${fileName}`, '📄');
      context.ui.divider();

      const lines = content.split('\n');
      if (lines.length > 30) {
        console.log(lines.slice(0, 30).join('\n'));
        console.log(`\n... (${lines.length - 30} more lines)`);
      } else {
        console.log(content);
      }
      console.log('');
      context.ui.divider();
    }

    // Ask what changes to make
    console.log('');
    context.ui.info('What changes would you like to make?', '💡');
    const instructions = await askQuestion(context.rl, 'Instructions: ');

    if (!instructions.trim()) {
      context.ui.warning('No instructions provided. Cancelled.');
      return;
    }

    context.ui.info('Thinking about the changes...');
    console.log('');

    // Define structured edit operations schema
    const editOperationsSchema = {
      type: 'json_schema',
      json_schema: {
        name: 'edit_operations',
        strict: true,
        schema: {
          type: 'object',
          properties: {
            edits: {
              type: 'array',
              description: 'Array of edit operations to apply to the file',
              items: {
                type: 'object',
                properties: {
                  operation: {
                    type: 'string',
                    enum: ['find_replace', 'replace_lines', 'insert_after_line'],
                    description: 'Type of edit operation'
                  },
                  find: {
                    type: 'string',
                    description: 'Exact text to find (for find_replace operation)'
                  },
                  replace: {
                    type: 'string',
                    description: 'Replacement text (for find_replace operation)'
                  },
                  occurrence: {
                    type: 'number',
                    description: 'Which occurrence to replace: 1-based index, or 0 for all (for find_replace)'
                  },
                  start_line: {
                    type: 'number',
                    description: '1-indexed start line (for replace_lines operation)'
                  },
                  end_line: {
                    type: 'number',
                    description: '1-indexed end line (for replace_lines operation)'
                  },
                  new_content: {
                    type: 'string',
                    description: 'New content for line range (for replace_lines operation)'
                  },
                  line_number: {
                    type: 'number',
                    description: 'Line number after which to insert (for insert_after_line, 0 for beginning)'
                  },
                  content: {
                    type: 'string',
                    description: 'Content to insert (for insert_after_line operation)'
                  }
                },
                required: ['operation'],
                additionalProperties: false
              }
            },
            explanation: {
              type: 'string',
              description: 'Brief explanation of changes made'
            }
          },
          required: ['edits'],
          additionalProperties: false
        }
      }
    };

    // Get AI suggestions with structured output
    const prompt = fileExists
      ? `I need to edit the file "${fileName}". Here's the current content with line numbers:\n\n${content.split('\n').map((line, i) => `${i + 1}: ${line}`).join('\n')}\n\nInstructions: ${instructions}\n\nProvide structured edit operations to make the requested changes. Use find_replace for simple text replacements, replace_lines for replacing line ranges, or insert_after_line for insertions.`
      : `I need to create a new file "${fileName}".\n\nInstructions: ${instructions}\n\nProvide the complete file content as a single insert_after_line operation at line 0.`;

    const messages = [
      { role: 'system', content: context.systemPrompt },
      { role: 'user', content: prompt }
    ];

    const apiResponse = await context.apiClient.makeRequest(messages, {
      response_format: editOperationsSchema,
      temperature: 0.2
    });

    // Parse structured response
    let editData;
    try {
      editData = JSON.parse(apiResponse?.message?.content || '{}');
    } catch (parseError) {
      context.ui.error(`Error parsing AI response: ${parseError.message}`);
      return;
    }

    if (!editData.edits || !Array.isArray(editData.edits) || editData.edits.length === 0) {
      context.ui.warning('No edit operations received from AI.');
      return;
    }

    // Show the suggested changes
    console.log('');
    context.ui.header('Suggested Changes', '📝');
    if (editData.explanation) {
      context.ui.info(editData.explanation);
    }
    context.ui.divider();
    editData.edits.forEach((edit, index) => {
      console.log(`${index + 1}. Operation: ${edit.operation}`);
      if (edit.operation === 'find_replace') {
        console.log(`   Find: "${edit.find?.substring(0, 60)}${edit.find?.length > 60 ? '...' : ''}"`);
        console.log(`   Replace: "${edit.replace?.substring(0, 60)}${edit.replace?.length > 60 ? '...' : ''}"`);
        console.log(`   Occurrence: ${edit.occurrence || 1}`);
      } else if (edit.operation === 'replace_lines') {
        console.log(`   Lines: ${edit.start_line} to ${edit.end_line}`);
        console.log(`   New content: "${edit.new_content?.substring(0, 60)}${edit.new_content?.length > 60 ? '...' : ''}"`);
      } else if (edit.operation === 'insert_after_line') {
        console.log(`   After line: ${edit.line_number}`);
        console.log(`   Content: "${edit.content?.substring(0, 60)}${edit.content?.length > 60 ? '...' : ''}"`);
      }
      console.log('');
    });
    context.ui.divider();

    // Confirm before writing
    const confirm = await askQuestion(context.rl, '\nApply these changes? (y/n): ');

    if (confirm.toLowerCase().startsWith('y')) {
      // Create backup for existing files
      if (fileExists) {
        const backupPath = `${filePath}.bak`;
        try {
          await fs.copyFile(filePath, backupPath);
          context.ui.success(`Backup created: ${path.basename(backupPath)}`, '💾');
        } catch (backupError) {
          context.ui.warning(`Could not create backup: ${backupError.message}`);
        }
      }

      // Apply structured edit operations
      let updatedContent = content;

      for (let i = 0; i < editData.edits.length; i++) {
        const edit = editData.edits[i];

        try {
          if (edit.operation === 'find_replace') {
            const find = edit.find || '';
            const replace = edit.replace || '';
            const occurrence = edit.occurrence || 1;

            if (occurrence === 0) {
              // Replace all occurrences
              updatedContent = updatedContent.split(find).join(replace);
            } else {
              // Replace specific occurrence
              let count = 0;
              updatedContent = updatedContent.replace(new RegExp(find.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), (match) => {
                count++;
                return count === occurrence ? replace : match;
              });
            }
          } else if (edit.operation === 'replace_lines') {
            const startLine = edit.start_line || 1;
            const endLine = edit.end_line || startLine;
            const newContent = edit.new_content || '';

            const lines = updatedContent.split('\n');
            if (startLine > 0 && startLine <= lines.length) {
              const deleteCount = Math.min(endLine, lines.length) - startLine + 1;
              const newLines = newContent === '' ? [] : newContent.split('\n');
              lines.splice(startLine - 1, Math.max(deleteCount, 0), ...newLines);
              updatedContent = lines.join('\n');
            }
          } else if (edit.operation === 'insert_after_line') {
            const lineNumber = edit.line_number || 0;
            const insertContent = edit.content || '';

            const lines = updatedContent.split('\n');
            const insertLines = insertContent.split('\n');
            lines.splice(lineNumber, 0, ...insertLines);
            updatedContent = lines.join('\n');
          }
        } catch (editError) {
          context.ui.warning(`Failed to apply edit ${i + 1}: ${editError.message}`);
        }
      }

      // Security: Use atomic write to prevent TOCTOU vulnerabilities
      if (!fileExists) {
        // For new files, use 'wx' flag to ensure exclusive creation
        const fd = await fs.open(filePath, 'wx');
        try {
          await fd.writeFile(updatedContent, 'utf8');
        } finally {
          await fd.close();
        }
      } else {
        // For overwrites, write to temp file then atomic rename
        const tempPath = `${filePath}.tmp.${Date.now()}`;
        await fs.writeFile(tempPath, updatedContent, 'utf8');

        try {
          await fs.rename(tempPath, filePath);
        } catch (error) {
          // Cleanup temp file on rename failure
          await fs.unlink(tempPath).catch(() => { }); // Ignore cleanup errors
          throw error;
        }
      }

      // Security: post-write validation to ensure no symlink was created
      await validateSecurePath(filePath, context.workingDirectory, 'edit');

      console.log('');
      context.ui.success(`File "${fileName}" has been ${fileExists ? 'updated' : 'created'}!`);

      // Offer to open the file
      const openFile = await askQuestion(context.rl, 'Would you like to open it? (y/n): ');
      if (openFile.toLowerCase().startsWith('y')) {
        await open(filePath);
      }
    } else {
      console.log('');
      context.ui.warning('Changes cancelled.');
    }

  } catch (error) {
    context.ui.error(`Error editing file: ${error.message}`);
  }
}

module.exports = editCommand;
