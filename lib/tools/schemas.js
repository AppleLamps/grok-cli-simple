const toolSchemas = [
  {
    type: 'function',
    function: {
      name: 'list_context',
      description: 'List currently cached project files with metadata and content previews',
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
      description: 'Refresh the project file cache by scanning the workspace. Use when you need to see recently created/modified files.',
      parameters: {
        type: 'object',
        properties: {
          limit: {
            type: 'integer',
            description: 'Maximum number of files to scan (1-100)',
            minimum: 1,
            maximum: 100,
            default: 20
          },
          include_metadata: {
            type: 'boolean',
            description: 'Include file size and modification time',
            default: false
          },
          include_hidden: {
            type: 'boolean',
            description: 'Include hidden files (starting with .)',
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
      description: 'Read the contents of a file in the workspace. Supports line range slicing.',
      parameters: {
        type: 'object',
        properties: {
          path: {
            type: 'string',
            description: 'Relative path to the file from workspace root'
          },
          lines: {
            type: 'object',
            description: 'Optional line range to read',
            properties: {
              start: {
                type: 'integer',
                description: '1-indexed start line',
                minimum: 1
              },
              end: {
                type: 'integer',
                description: '1-indexed end line',
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
      description: 'Search for text across all files in the workspace. Returns file paths, line numbers, and matching snippets.',
      parameters: {
        type: 'object',
        properties: {
          query: {
            type: 'string',
            description: 'Search query (case-insensitive substring match)'
          },
          max_results: {
            type: 'integer',
            description: 'Maximum number of matches to return (1-50)',
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
      description: 'List files and directories in the workspace with configurable depth and filtering',
      parameters: {
        type: 'object',
        properties: {
          path: {
            type: 'string',
            description: 'Starting path (relative to workspace root)',
            default: '.'
          },
          max_depth: {
            type: 'integer',
            description: 'Maximum directory depth to traverse (0-10)',
            minimum: 0,
            maximum: 10,
            default: 2
          },
          include_files: {
            type: 'boolean',
            description: 'Include files in results',
            default: true
          },
          include_hidden: {
            type: 'boolean',
            description: 'Include hidden files/directories',
            default: false
          },
          limit: {
            type: 'integer',
            description: 'Maximum number of entries to return (1-500)',
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
      description: 'Edit an existing file using find/replace or line range operations. Multiple operations can be applied sequentially.',
      parameters: {
        type: 'object',
        properties: {
          path: {
            type: 'string',
            description: 'Relative path to the file'
          },
          operations: {
            type: 'array',
            description: 'Array of edit operations to apply',
            items: {
              type: 'object',
              oneOf: [
                {
                  properties: {
                    type: {
                      type: 'string',
                      enum: ['replace'],
                      description: 'Find and replace operation'
                    },
                    find: {
                      type: 'string',
                      description: 'Text to find (literal string match)'
                    },
                    replace: {
                      type: 'string',
                      description: 'Replacement text'
                    },
                    replace_all: {
                      type: 'boolean',
                      description: 'Replace all occurrences (default: false, replaces first only)',
                      default: false
                    },
                    count: {
                      type: 'integer',
                      description: 'Number of replacements to make (ignored if replace_all is true)',
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
                      description: 'Replace a line range'
                    },
                    start: {
                      type: 'integer',
                      description: '1-indexed start line',
                      minimum: 1
                    },
                    end: {
                      type: 'integer',
                      description: '1-indexed end line',
                      minimum: 1
                    },
                    text: {
                      type: 'string',
                      description: 'Replacement text'
                    }
                  },
                  required: ['type', 'start', 'text']
                }
              ]
            }
          },
          refresh_context: {
            type: 'boolean',
            description: 'Refresh project context after edit',
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
      description: 'Create a new file or overwrite an existing file with specified content',
      parameters: {
        type: 'object',
        properties: {
          path: {
            type: 'string',
            description: 'Relative path for the new file'
          },
          content: {
            type: 'string',
            description: 'File content',
            default: ''
          },
          overwrite: {
            type: 'boolean',
            description: 'Allow overwriting existing files',
            default: false
          },
          refresh_context: {
            type: 'boolean',
            description: 'Refresh project context after creation',
            default: false
          }
        },
        required: ['path']
      }
    }
  }
];

module.exports = toolSchemas;
