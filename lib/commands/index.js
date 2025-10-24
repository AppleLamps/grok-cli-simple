// Command exports
const helpCommand = require('./help');
const readCommand = require('./read');
const editCommand = require('./edit');
const searchCommand = require('./search');
const openCommand = require('./open');
const historyCommand = require('./history');

module.exports = {
  help: helpCommand,
  read: readCommand,
  edit: editCommand,
  search: searchCommand,
  open: openCommand,
  history: historyCommand
};
