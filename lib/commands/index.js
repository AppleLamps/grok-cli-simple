// Command exports
const helpCommand = require('./help');
const readCommand = require('./read');
const editCommand = require('./edit');
const searchCommand = require('./search');
const openCommand = require('./open');
const historyCommand = require('./history');
const extractCommand = require('./extract');
const estimateCommand = require('./estimate');
const configCommand = require('./config');
const clearLogsCommand = require('./clear-logs');

module.exports = {
  help: helpCommand,
  read: readCommand,
  edit: editCommand,
  search: searchCommand,
  open: openCommand,
  history: historyCommand,
  extract: extractCommand,
  estimate: estimateCommand,
  config: configCommand,
  clearLogs: clearLogsCommand
};
