const fs = require('fs').promises;
const path = require('path');

/**
 * Secure helper to validate a path is inside the workspace.
 * Uses path.relative() to prevent prefix attacks (e.g., /workspace vs /workspace-other).
 * @param {string} baseDir - Absolute base directory path
 * @param {string} targetPath - Absolute target path to validate
 * @param {string} toolName - Name of tool for error messages
 * @returns {string} The validated target path
 * @throws {Error} If path is outside workspace or attempts traversal
 */
function assertInsideWorkspace(baseDir, targetPath, toolName) {
  const base = path.resolve(baseDir);
  const target = path.resolve(targetPath);
  const rel = path.relative(base, target);

  // Empty or '.' means same directory - allowed
  if (rel === '' || rel === '.') {
    return target;
  }

  // If relative path starts with '..' or is absolute, it's outside workspace
  if (rel.startsWith('..') || path.isAbsolute(rel)) {
    throw new Error(`Tool "${toolName}" cannot access paths outside the workspace: ${path.basename(targetPath)}`);
  }

  return target;
}

/**
 * Ensures a relative path resolves inside the working directory.
 * @param {string} relativePath - Relative path to validate
 * @param {string} workingDirectory - Absolute workspace root directory
 * @param {string} toolName - Name of tool for error messages
 * @returns {string} The validated absolute path
 * @throws {Error} If path is outside workspace
 */
function ensureInsideWorkingDirectory(relativePath, workingDirectory, toolName) {
  const resolvedBase = path.resolve(workingDirectory);
  const resolvedTarget = path.resolve(workingDirectory, relativePath);

  // Use secure path.relative check instead of vulnerable startsWith
  return assertInsideWorkspace(resolvedBase, resolvedTarget, toolName);
}

/**
 * Secure validation of file paths to prevent symlink attacks and path traversal.
 * Resolves symlinks consistently, validates workspace containment, and blocks symlink targets.
 * @param {string} targetPath - Absolute target path to validate
 * @param {string} workingDirectory - Absolute workspace root directory
 * @param {string} toolName - Name of tool for error messages
 * @throws {Error} If path is outside workspace, points to symlink, or resolves to invalid location
 */
async function validateSecurePath(targetPath, workingDirectory, toolName) {
  const realPath = await fs.realpath(targetPath).catch(() => targetPath);
  assertInsideWorkspace(path.resolve(workingDirectory), realPath, toolName);
  const stats = await fs.lstat(realPath).catch(() => null);
  if (stats && stats.isSymbolicLink()) {
    throw new Error(`Symlinks are not allowed for security reasons.`);
  }
}

module.exports = {
  assertInsideWorkspace,
  ensureInsideWorkingDirectory,
  validateSecurePath
};
