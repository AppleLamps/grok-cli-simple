const fs = require('fs').promises;
const path = require('path');
const open = require('open');
const { askQuestion } = require('../utils/prompt');
const { assertInsideWorkspace, validateSecurePath } = require('../utils/pathSecurity');

async function editCommand(input, context) {
  const fileName = input.slice(5).trim();
  
  if (!fileName) {
    console.log('Please provide a filename. Usage: edit <file>');
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
    console.log(`Security Error: ${error.message}`);
    return;
  }

  try {
    // Check if file exists
    const fileExists = await fs.access(filePath).then(() => true).catch(() => false);
    
    if (!fileExists) {
      console.log(`File "${fileName}" not found.`);
      const create = await askQuestion(context.rl, 'Would you like to create it? (y/n): ');
      
      if (!create.toLowerCase().startsWith('y')) {
        return;
      }
    }

    // Read existing content or start empty
    let content = '';
    if (fileExists) {
      content = await fs.readFile(filePath, 'utf8');
      console.log(`\n📄 Current content of ${fileName}:\n`);
      console.log('─'.repeat(50));
      
      const lines = content.split('\n');
      if (lines.length > 30) {
        console.log(lines.slice(0, 30).join('\n'));
        console.log(`\n... (${lines.length - 30} more lines)`);
      } else {
        console.log(content);
      }
      console.log('─'.repeat(50));
    }

    // Ask what changes to make
    console.log('\n💡 What changes would you like to make?');
    const instructions = await askQuestion(context.rl, 'Instructions: ');

    if (!instructions.trim()) {
      console.log('No instructions provided. Cancelled.');
      return;
    }

    console.log('\nThinking about the changes...');

    // Get AI suggestions
    const prompt = fileExists 
      ? `I need to edit the file "${fileName}". Here's the current content:\n\n\`\`\`\n${content}\n\`\`\`\n\nInstructions: ${instructions}\n\nPlease provide the complete updated file content. Return ONLY the code, no explanations.`
      : `I need to create a new file "${fileName}".\n\nInstructions: ${instructions}\n\nPlease provide the complete file content. Return ONLY the code, no explanations.`;

    const messages = [
      { role: 'system', content: context.systemPrompt },
      { role: 'user', content: prompt }
    ];

    const response = await context.apiClient.makeRequest(messages);

    // Extract content from message object
    const suggestion = response?.content || '';

    // Extract code from markdown if present
    let newContent = suggestion;
    const codeBlockMatch = suggestion.match(/```(?:\w+)?\n([\s\S]*?)```/);
    if (codeBlockMatch) {
      newContent = codeBlockMatch[1].trim();
    }

    // Show the suggested changes
    console.log('\n📝 Suggested changes:\n');
    console.log('─'.repeat(50));
    const suggestionLines = newContent.split('\n');
    if (suggestionLines.length > 40) {
      console.log(suggestionLines.slice(0, 40).join('\n'));
      console.log(`\n... (${suggestionLines.length - 40} more lines)`);
    } else {
      console.log(newContent);
    }
    console.log('─'.repeat(50));

    // Confirm before writing
    const confirm = await askQuestion(context.rl, '\nApply these changes? (y/n): ');

    if (confirm.toLowerCase().startsWith('y')) {
      // Create backup for existing files
      if (fileExists) {
        const backupPath = `${filePath}.bak`;
        try {
          await fs.copyFile(filePath, backupPath);
          console.log(`   💾 Backup created: ${path.basename(backupPath)}`);
        } catch (backupError) {
          console.log(`   ⚠️ Warning: Could not create backup: ${backupError.message}`);
        }
      }

      // Security: Use atomic write to prevent TOCTOU vulnerabilities
      if (!fileExists) {
        // For new files, use 'wx' flag to ensure exclusive creation
        const fd = await fs.open(filePath, 'wx');
        try {
          await fd.writeFile(newContent, 'utf8');
        } finally {
          await fd.close();
        }
      } else {
        // For overwrites, write to temp file then atomic rename
        const tempPath = `${filePath}.tmp.${Date.now()}`;
        await fs.writeFile(tempPath, newContent, 'utf8');
        
        try {
          await fs.rename(tempPath, filePath);
        } catch (error) {
          // Cleanup temp file on rename failure
          await fs.unlink(tempPath).catch(() => {}); // Ignore cleanup errors
          throw error;
        }
      }
      
      // Security: post-write validation to ensure no symlink was created
      await validateSecurePath(filePath, context.workingDirectory, 'edit');
      
      console.log(`\n✅ File "${fileName}" has been ${fileExists ? 'updated' : 'created'}!`);
      
      // Offer to open the file
      const openFile = await askQuestion(context.rl, 'Would you like to open it? (y/n): ');
      if (openFile.toLowerCase().startsWith('y')) {
        await open(filePath);
      }
    } else {
      console.log('\n❌ Changes cancelled.');
    }

  } catch (error) {
    console.log(`Error editing file: ${error.message}`);
  }
}

module.exports = editCommand;
