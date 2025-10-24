const SECTION_DIVIDER = '─'.repeat(60);

function formatTimestamp(value) {
  if (!value) {
    return 'unknown';
  }

  try {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return value;
    }
    return date.toLocaleString();
  } catch (error) {
    return value;
  }
}

function formatArgs(args) {
  if (!args || typeof args !== 'object') {
    return null;
  }

  const keys = Object.keys(args);
  if (keys.length === 0) {
    return null;
  }

  return keys.map((key) => `${key}: ${JSON.stringify(args[key])}`).join(', ');
}

async function historyCommand(input, context) {
  const getHistory = typeof context.getToolHistory === 'function' ? context.getToolHistory : null;
  const getDivider = typeof context.getDivider === 'function' ? context.getDivider : null;
  const getUIConfig = typeof context.getUIConfig === 'function' ? context.getUIConfig : null;

  const history = Array.isArray(getHistory?.()) ? getHistory() : [];

  const divider = getDivider ? getDivider() : SECTION_DIVIDER;
  const uiConfig = getUIConfig ? getUIConfig() : { verbosity: 'detailed' };
  const includeDetails = uiConfig?.verbosity !== 'minimal';

  if (history.length === 0) {
    console.log(`\n${divider}`);
    console.log('No tool calls have been recorded yet.');
    console.log(divider);
    return;
  }

  const entries = history.slice(-10).reverse();

  console.log(`\n${divider}`);
  console.log('🕑 Recent tool activity');
  console.log(divider);

  entries.forEach((entry, index) => {
    const timestamp = formatTimestamp(entry.timestamp);
    const status = entry.status || 'unknown';
    const duration = typeof entry.durationMs === 'number' ? `${entry.durationMs} ms` : 'n/a';
    const summaryLines = Array.isArray(entry.summary) ? entry.summary : [];
    const argsSummary = formatArgs(entry.args);

    console.log(`${index + 1}. ${timestamp} — ${entry.tool || 'unknown tool'}`);
    console.log(`   Status: ${status}${status === 'success' && entry.resultType ? ` (${entry.resultType})` : ''}`);
    console.log(`   Duration: ${duration}`);

    if (includeDetails && summaryLines.length > 0) {
      summaryLines.forEach((line) => {
        console.log(`   ${line}`);
      });
    }

    if (includeDetails && argsSummary) {
      console.log(`   Args: ${argsSummary}`);
    }

    if (includeDetails && entry.error) {
      console.log(`   Error: ${entry.error}`);
    }

    if (index < entries.length - 1) {
      console.log(divider);
    }
  });

  console.log(divider);
}

module.exports = historyCommand;
