// Shared helpers for tools. Keep logic identical to original implementations.

function ensureString(value, fieldName, toolName) {
  if (typeof value !== 'string' || value.trim() === '') {
    throw new Error(`Tool "${toolName}" requires a non-empty string for "${fieldName}".`);
  }
  return value.trim();
}

function clampLines(lines, start, end) {
  const safeStart = Number.isInteger(start) ? Math.max(start, 1) : 1;
  const safeEnd = Number.isInteger(end) ? Math.min(end, lines.length) : lines.length;
  return [safeStart, safeEnd];
}

function ensurePositiveInteger(value, fieldName, toolName) {
  const parsed = Number.parseInt(value, 10);

  if (!Number.isInteger(parsed) || parsed <= 0) {
    throw new Error(`Tool "${toolName}" requires a positive integer for "${fieldName}".`);
  }

  return parsed;
}

function applyLimitedReplacements(source, find, replaceWith, limit) {
  // Escape regex special characters for literal string matching
  const escapedFind = find.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(escapedFind, 'g');
  
  let replacements = 0;
  let lastIndex = 0;
  let result = '';
  
  if (limit <= 0) {
    return {
      text: source,
      replacements: 0
    };
  }
  
  // Use regex exec for non-overlapping matches
  let match;
  while ((match = regex.exec(source)) !== null && replacements < limit) {
    // Append text before match
    result += source.slice(lastIndex, match.index);
    // Append replacement
    result += replaceWith;
    lastIndex = regex.lastIndex;
    replacements++;
  }
  
  // Append remaining text
  result += source.slice(lastIndex);
  
  return {
    text: result,
    replacements
  };
}

// Default limit for file scanning to prevent performance issues on large repos
const DEFAULT_SEARCH_LIMIT = 1000;

module.exports = {
  ensureString,
  clampLines,
  ensurePositiveInteger,
  applyLimitedReplacements,
  DEFAULT_SEARCH_LIMIT
};
