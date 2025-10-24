/**
 * Shared UI utilities for consistent formatting across commands
 */

const SECTION_DIVIDER = '─'.repeat(60);

/**
 * Print a section divider line
 */
function printDivider() {
  console.log(SECTION_DIVIDER);
}

/**
 * Get a section divider string
 * @returns {string} Divider line
 */
function getDivider() {
  return SECTION_DIVIDER;
}

/**
 * Print a section header with dividers
 * @param {string} title - Header text
 */
function printSection(title) {
  console.log(`\n${SECTION_DIVIDER}`);
  console.log(title);
  console.log(SECTION_DIVIDER);
}

/**
 * Print an error section
 * @param {string} message - Error message
 */
function printError(message) {
  console.log(`\n${SECTION_DIVIDER}`);
  console.log(`❌ ${message}`);
  console.log(SECTION_DIVIDER);
}

module.exports = {
  SECTION_DIVIDER,
  printDivider,
  getDivider,
  printSection,
  printError
};
