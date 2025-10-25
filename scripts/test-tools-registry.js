#!/usr/bin/env node
const fs = require('fs').promises;
const path = require('path');

async function main() {
  const tools = require('../lib/tools');
  const requiredKeys = [
    'list_context',
    'refresh_context',
    'read_file',
    'search_code',
    'edit_file',
    'create_file',
    'list_directory',
    'assertInsideWorkspace',
    'validateSecurePath',
    'toolSchemas'
  ];

  // Verify registry keys exist
  const missing = requiredKeys.filter((k) => !(k in tools));
  if (missing.length) {
    throw new Error(`Missing exports from tools registry: ${missing.join(', ')}`);
  }

  const workingDirectory = path.resolve(process.cwd());
  const tmpRoot = path.join(workingDirectory, 'tmp-tools-test');
  const sampleFileRel = path.join('tmp-tools-test', 'sample.txt');
  const sampleFileAbs = path.join(workingDirectory, sampleFileRel);
  const newFileRel = path.join('tmp-tools-test', 'new.txt');
  const newFileAbs = path.join(workingDirectory, newFileRel);

  // Minimal fileScanner mock sufficient for tool calls used here
  const fileScanner = {
    async buildDirectoryIndex({ startPath='.', maxDepth=2, includeFiles=true, includeHidden=false, limit=200 } = {}) {
      // Return index with tmp dir and files
      const entries = [];
      entries.push({ type: 'dir', path: 'tmp-tools-test', depth: 0 });
      try {
        const files = await fs.readdir(tmpRoot, { withFileTypes: true });
        for (const de of files) {
          if (entries.length >= limit) break;
          entries.push({ type: de.isDirectory() ? 'dir' : 'file', path: path.join('tmp-tools-test', de.name), depth: 1 });
        }
      } catch (_) {}
      return entries;
    },
    async getRelevantFiles(_start='.', _opts={}) {
      // Only return our sample file if it exists
      const exists = await fs.access(sampleFileAbs).then(() => true).catch(() => false);
      return exists ? [sampleFileAbs] : [];
    },
    async scanProjectFiles({ limit=20, includeContent=true } = {}) {
      const files = [];
      const exists = await fs.access(sampleFileAbs).then(() => true).catch(() => false);
      if (exists) {
        const content = includeContent ? await fs.readFile(sampleFileAbs, 'utf8') : undefined;
        files.push({ path: sampleFileRel, content: content ?? '', size: content ? content.length : 0, modified: new Date().toISOString() });
      }
      return files.slice(0, limit);
    }
  };

  const context = {
    workingDirectory,
    fileScanner,
    setProjectFiles: () => {},
    refreshProjectEntry: async (relPath, _opts) => {
      const full = path.join(workingDirectory, relPath);
      const stat = await fs.stat(full).catch(() => null);
      return stat ? { size: stat.size, modified: new Date(stat.mtimeMs).toISOString() } : null;
    }
  };

  // Prepare temp directory and sample file
  await fs.mkdir(tmpRoot, { recursive: true });
  await fs.writeFile(sampleFileAbs, 'hello\nworld\n', 'utf8');

  // Execute tools
  const results = {};
  results.list = await tools.list_context({}, context);
  results.read = await tools.read_file({ path: sampleFileRel }, context);
  results.search = await tools.search_code({ query: 'hello', max_results: 5 }, context);
  results.edit = await tools.edit_file({
    path: sampleFileRel,
    operations: [
      { type: 'replace', find: 'hello', replace: 'hi', replace_all: false }
    ]
  }, context);
  results.create = await tools.create_file({ path: newFileRel, content: 'new file', overwrite: true }, context);
  results.dir = await tools.list_directory({ path: 'tmp-tools-test', max_depth: 1 }, context);
  results.refresh = await tools.refresh_context({ limit: 5, include_metadata: true }, context);

  // Basic assertions
  if (!Array.isArray(tools.toolSchemas) || tools.toolSchemas.length === 0) {
    throw new Error('toolSchemas is missing or empty');
  }

  console.log('Tools registry wiring OK');
  console.log('- list_context count:', results.list.count);
  console.log('- read_file bytes:', results.read.content.length);
  console.log('- search_code matches:', results.search.matches.length);
  console.log('- edit_file status:', results.edit.status);
  console.log('- create_file status:', results.create.status);
  console.log('- list_directory entries:', results.dir.entries.length);
  console.log('- refresh_context files:', results.refresh.files.length);

  // Cleanup
  await fs.unlink(sampleFileAbs).catch(() => {});
  await fs.unlink(newFileAbs).catch(() => {});
  await fs.rmdir(tmpRoot).catch(() => {});
}

main().catch((err) => {
  console.error('Test failed:', err && err.message ? err.message : err);
  process.exit(1);
});
