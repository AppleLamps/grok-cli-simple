const { askQuestion } = require('../utils/prompt');

async function clearLogsCommand(input, context) {
  const args = input.slice(11).trim().toLowerCase();
  const force = args === '--force' || args === '-f';

  console.log('');
  context.ui.header('Clear LampCode Logs', '🗑️');
  context.ui.divider();

  // Get log stats
  const stats = await context.logger.getStats();

  if (!stats || !stats.enabled) {
    context.ui.info('Logging is currently disabled.');
    context.ui.divider();
    return;
  }

  // Display current stats
  console.log(`  Log Directory: ${stats.log_dir}`);
  console.log(`  Sessions: ${stats.sessions}`);
  console.log(`  Tool History Size: ${formatBytes(stats.tool_history_size)}`);
  console.log(`  Changes Size: ${formatBytes(stats.changes_size)}`);
  console.log('');
  context.ui.divider();

  // Confirm deletion
  if (!force) {
    const confirm = await askQuestion(
      context.rl,
      'Are you sure you want to delete all logs? This cannot be undone. (y/N): '
    );

    if (!confirm.toLowerCase().startsWith('y')) {
      context.ui.info('Cancelled.');
      return;
    }
  }

  // Clear logs
  try {
    const result = await context.logger.clearAllLogs();
    console.log('');
    context.ui.success(`Deleted ${result.deleted} log file(s)`);
    context.ui.divider();
  } catch (error) {
    context.ui.error(`Error clearing logs: ${error.message}`);
  }
}

function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

module.exports = clearLogsCommand;

