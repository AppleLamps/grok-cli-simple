const toolSchemas = [
  {
    type: 'function',
    function: {
      name: 'list_context',
      description: 'List currently cached project files with metadata and content previews. Use this to see what files are already loaded in memory before reading additional files. Helps avoid redundant file reads and understand the current context.',
      parameters: {
        type: 'object',
        properties: {},
        required: []
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'refresh_context',
      description: 'Refresh the project file cache by scanning the workspace. Use this when you need to see recently created or modified files that are not yet in the cached context. Essential after creating new files or when the user mentions files you cannot find in the current context.',
      parameters: {
        type: 'object',
        properties: {
          limit: {
            type: 'integer',
            description: 'Maximum number of files to scan (1-100). Default is 20. Use lower values (10-15) for faster scans, higher values (50-100) when you need comprehensive coverage.',
            minimum: 1,
            maximum: 100,
            default: 20
          },
          include_metadata: {
            type: 'boolean',
            description: 'Include file size and modification time in results. Set to true when you need to check file sizes or last modified dates.',
            default: false
          },
          include_hidden: {
            type: 'boolean',
            description: 'Include hidden files (starting with .). Set to true only when working with configuration files like .env, .gitignore, etc.',
            default: false
          }
        },
        required: []
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'read_file',
      description: 'Read the contents of a file in the workspace. Supports line range slicing for large files. Use this to examine specific files or code sections. For large files (>500 lines), always use line ranges to avoid token overflow. Example paths: "src/index.js", "lib/utils/helper.js"',
      parameters: {
        type: 'object',
        properties: {
          path: {
            type: 'string',
            description: 'Relative path to the file from workspace root. Examples: "src/index.js", "lib/utils/helper.js", "package.json". Do not use absolute paths or paths starting with "/".'
          },
          lines: {
            type: 'object',
            description: 'Optional line range to read. Use this for large files to read specific sections. Example: {start: 1, end: 50} reads lines 1-50. Omit to read the entire file.',
            properties: {
              start: {
                type: 'integer',
                description: '1-indexed start line (inclusive). Must be >= 1.',
                minimum: 1
              },
              end: {
                type: 'integer',
                description: '1-indexed end line (inclusive). Must be >= start. Example: start=10, end=20 reads 11 lines.',
                minimum: 1
              }
            }
          }
        },
        required: ['path']
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'search_code',
      description: 'Search for text patterns across all files in the workspace. Returns file paths, line numbers, and matching snippets. Use this to find function definitions, class names, imports, or any text pattern across the codebase. Case-insensitive substring matching.',
      parameters: {
        type: 'object',
        properties: {
          query: {
            type: 'string',
            description: 'Search query text (case-insensitive substring match). Examples: "function handleClick", "import React", "class UserModel". Searches file content, not file names.'
          },
          max_results: {
            type: 'integer',
            description: 'Maximum number of matches to return (1-50). Default is 20. Use lower values (10-15) for focused searches, higher values (30-50) for comprehensive searches. Each result includes file path, line number, and surrounding context.',
            minimum: 1,
            maximum: 50,
            default: 20
          }
        },
        required: ['query']
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'list_directory',
      description: 'List files and directories in the workspace with configurable depth and filtering. Use this to explore project structure, understand directory organization, or find files in specific locations. Be mindful of max_depth to avoid performance issues in large projects.',
      parameters: {
        type: 'object',
        properties: {
          path: {
            type: 'string',
            description: 'Starting path relative to workspace root. Examples: "." for root, "src" for src directory, "lib/utils" for nested directory. Do not use absolute paths.',
            default: '.'
          },
          max_depth: {
            type: 'integer',
            description: 'Maximum directory depth to traverse (0-10). 0 = current directory only, 1 = one level deep, 2 = two levels deep (default). Higher values may impact performance in large projects.',
            minimum: 0,
            maximum: 10,
            default: 2
          },
          include_files: {
            type: 'boolean',
            description: 'Include files in results. Set to false if you only want to see directory structure without individual files.',
            default: true
          },
          include_hidden: {
            type: 'boolean',
            description: 'Include hidden files/directories (starting with .). Set to true when you need to see configuration files like .env, .gitignore, .eslintrc, etc.',
            default: false
          },
          limit: {
            type: 'integer',
            description: 'Maximum number of entries to return (1-500). Default is 200. Use lower values for faster results, higher values for comprehensive listings.',
            minimum: 1,
            maximum: 500,
            default: 200
          }
        },
        required: []
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'edit_file',
      description: 'Edit an existing file using find/replace or line range operations. Multiple operations can be applied sequentially. Use this for targeted modifications to existing files. Always read the file first to understand its current content before editing. For simple text replacements, use "replace" type. For replacing entire line ranges, use "replace_range" type.',
      parameters: {
        type: 'object',
        properties: {
          path: {
            type: 'string',
            description: 'Relative path to the file to edit. Examples: "src/index.js", "lib/utils/helper.js". File must exist - use create_file for new files.'
          },
          operations: {
            type: 'array',
            description: 'Array of edit operations to apply sequentially. Each operation is applied to the result of the previous operation. Use multiple operations to make several changes in one call.',
            items: {
              type: 'object',
              oneOf: [
                {
                  properties: {
                    type: {
                      type: 'string',
                      enum: ['replace'],
                      description: 'Find and replace operation for text substitution'
                    },
                    find: {
                      type: 'string',
                      description: 'Exact text to find (literal string match, case-sensitive). Must match exactly including whitespace. Example: "const oldName = " to find and replace variable declarations.'
                    },
                    replace: {
                      type: 'string',
                      description: 'Replacement text. Can be empty string to delete the found text. Preserves surrounding context.'
                    },
                    replace_all: {
                      type: 'boolean',
                      description: 'Replace all occurrences (true) or just the first occurrence (false, default). Set to true when you want to replace every instance of the text.',
                      default: false
                    },
                    count: {
                      type: 'integer',
                      description: 'Number of replacements to make (ignored if replace_all is true). Use this to replace only the first N occurrences.',
                      minimum: 1
                    }
                  },
                  required: ['type', 'find', 'replace']
                },
                {
                  properties: {
                    type: {
                      type: 'string',
                      enum: ['replace_range'],
                      description: 'Replace a range of lines with new content'
                    },
                    start: {
                      type: 'integer',
                      description: '1-indexed start line (inclusive). Line 1 is the first line of the file.',
                      minimum: 1
                    },
                    end: {
                      type: 'integer',
                      description: '1-indexed end line (inclusive). Must be >= start. Example: start=5, end=10 replaces lines 5-10 (6 lines total).',
                      minimum: 1
                    },
                    text: {
                      type: 'string',
                      description: 'Replacement text for the line range. Can span multiple lines (use \\n). Can be empty string to delete the lines.'
                    }
                  },
                  required: ['type', 'start', 'text']
                }
              ]
            }
          },
          refresh_context: {
            type: 'boolean',
            description: 'Refresh project context after edit to update cached file content. Set to true if you need to immediately read the updated file or if other tools need to see the changes.',
            default: false
          }
        },
        required: ['path', 'operations']
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'create_file',
      description: 'Create a new file with specified content. Can also overwrite existing files if overwrite=true. All file operations are restricted to the workspace directory for security. Use this to generate new source files, configuration files, or documentation.',
      parameters: {
        type: 'object',
        properties: {
          path: {
            type: 'string',
            description: 'Relative path for the new file. Examples: "src/newComponent.js", "docs/README.md". Path must be within workspace boundaries. Parent directories will be created if they do not exist.'
          },
          content: {
            type: 'string',
            description: 'File content as a string. Can include newlines (\\n) for multi-line content. Can be empty string to create an empty file.',
            default: ''
          },
          overwrite: {
            type: 'boolean',
            description: 'Allow overwriting existing files. Set to true only when you intentionally want to replace an existing file. Default is false for safety.',
            default: false
          },
          refresh_context: {
            type: 'boolean',
            description: 'Refresh project context after creation to make the new file visible in cached context. Set to true if you need to immediately read the file or if other operations depend on it.',
            default: false
          }
        },
        required: ['path']
      }
    }
  }
];

module.exports = toolSchemas;
