const vscode = require("vscode");
const { registerCommands } = require('./src/commands/registerCommands');
const { initRunning } = require('./src/services/initRunning');
const { registerWorkSpace } = require('./src/workspace/registerWorkSpace');
const { registerCompletion } = require('./src/completion/registerCompletion');

/**
 * @param {vscode.ExtensionContext} context
 */
function init(context) {
  const wsPath = vscode.workspace.workspaceFolders[0].uri.fsPath;
  context.workspaceState.update('wsPath', wsPath);
}

/**
 * @param {vscode.ExtensionContext} context
 */
async function activate(context) {
  init(context);
  registerCommands(context);
  registerCompletion(context);
  initRunning(context);
  registerWorkSpace(context);
}
module.exports = {
  activate,
}
