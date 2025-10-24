const UI = require('../utils/ui');

async function helpCommand() {
  const ui = new UI(70);
  ui.commandList();
}

module.exports = helpCommand;
