const fs = require('fs').promises;
const path = require('path');
const { assertInsideWorkspace, validateSecurePath } = require('../utils/pathSecurity');

async function extractCommand(input, context) {
  // Parse command: extract <schema_file> from <target_file>
  // OR: extract <schema_file> <target_file>
  const parts = input.slice(8).trim().split(/\s+/);

  let schemaFile, targetFile;

  // Try to parse "extract <schema> from <target>" format
  const fromIndex = parts.indexOf('from');
  if (fromIndex > 0 && fromIndex < parts.length - 1) {
    schemaFile = parts.slice(0, fromIndex).join(' ');
    targetFile = parts.slice(fromIndex + 1).join(' ');
  } else if (parts.length >= 2) {
    // Try "extract <schema> <target>" format
    schemaFile = parts[0];
    targetFile = parts.slice(1).join(' ');
  } else {
    context.ui.error('Usage: extract <schema_file> from <target_file>');
    context.ui.info('   or: extract <schema_file> <target_file>');
    return;
  }

  if (!schemaFile || !targetFile) {
    context.ui.error('Please provide both schema file and target file.');
    context.ui.info('Usage: extract <schema_file> from <target_file>');
    return;
  }

  // Validate and resolve paths using secure helper
  let schemaPath, targetPath;
  try {
    const resolvedBase = path.resolve(context.workingDirectory);
    const resolvedSchema = path.resolve(context.workingDirectory, schemaFile);
    const resolvedTarget = path.resolve(context.workingDirectory, targetFile);

    schemaPath = assertInsideWorkspace(resolvedBase, resolvedSchema, 'extract');
    targetPath = assertInsideWorkspace(resolvedBase, resolvedTarget, 'extract');

    // Validate secure paths (prevents symlink traversal)
    await validateSecurePath(schemaPath, context.workingDirectory, 'extract');
    await validateSecurePath(targetPath, context.workingDirectory, 'extract');
  } catch (error) {
    context.ui.error(`Security Error: ${error.message}`);
    return;
  }

  try {
    // Check if files exist
    await fs.access(schemaPath);
    await fs.access(targetPath);
  } catch (error) {
    if (error.code === 'ENOENT') {
      context.ui.error(`File not found: ${error.path === schemaPath ? schemaFile : targetFile}`);
    } else {
      context.ui.error(`Error accessing files: ${error.message}`);
    }
    return;
  }

  try {
    // Read and parse the JSON schema
    const schemaContent = await fs.readFile(schemaPath, 'utf8');
    let schema;

    try {
      schema = JSON.parse(schemaContent);
    } catch (parseError) {
      context.ui.error(`Error parsing schema file: ${parseError.message}`);
      context.ui.info('Schema file must contain valid JSON.');
      return;
    }

    // Read the target file content
    const targetContent = await fs.readFile(targetPath, 'utf8');

    console.log('');
    context.ui.header(`Extracting from: ${targetFile}`, '📊');
    context.ui.info(`Using schema: ${schemaFile}`);
    context.ui.divider();

    // Construct AI prompt for extraction
    const prompt = `Extract information from the following content according to the provided schema. Return only valid JSON matching the schema.\n\nContent:\n${targetContent}`;

    const messages = [
      { role: 'system', content: context.systemPrompt },
      { role: 'user', content: prompt }
    ];

    // Build response_format with the schema
    const responseFormat = {
      type: 'json_schema',
      json_schema: {
        name: 'extracted_data',
        strict: true,
        schema: schema
      }
    };

    // Make API request with structured output
    const apiResponse = await context.apiClient.makeRequest(messages, {
      response_format: responseFormat,
      temperature: 0.2
    });

    // Parse the extracted data
    let extractedData;
    try {
      extractedData = JSON.parse(apiResponse?.message?.content || '{}');
    } catch (parseError) {
      context.ui.error(`Error parsing AI response: ${parseError.message}`);
      return;
    }

    // Display the extracted data
    console.log('');
    context.ui.success('Extraction complete!');
    context.ui.divider();
    console.log(JSON.stringify(extractedData, null, 2));
    console.log('');
    context.ui.divider();

  } catch (error) {
    context.ui.error(`Error during extraction: ${error.message}`);
  }
}

module.exports = extractCommand;

