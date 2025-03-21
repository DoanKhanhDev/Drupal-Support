const vscode = require("vscode");
const { registerCommands } = require('./src/commands/registerCommands');
const { initRunning } = require('./src/services/initRunning');
const { registerWorkSpace } = require('./src/workspace/registerWorkSpace');

/**
 * @param {vscode.ExtensionContext} context
 */
function init(context) {
  const wsPath = vscode.workspace.workspaceFolders[0].uri.fsPath;
  context.workspaceState.update('wsPath', wsPath);
}

/**
 * Checks if the current workspace contains a Drupal installation
 * @returns {Promise<boolean>}
 */
async function isDrupalWorkspace() {
  if (!vscode.workspace.workspaceFolders || vscode.workspace.workspaceFolders.length === 0) {
    return false;
  }

  try {
    // Use VS Code's file search to find Drupal.php
    const files = await vscode.workspace.findFiles(
      '**/core/lib/Drupal.php',
      '{**/node_modules,**/vendor}'
    );
    return files.length > 0;
  } catch (error) {
    console.error('Error checking for Drupal workspace:', error);
    return false;
  }
}

/**
 * @param {vscode.ExtensionContext} context
 */
async function activate(context) {
  // Only activate if this is a Drupal workspace
  if (!await isDrupalWorkspace()) {
    return;
  }

  init(context);
  registerCommands(context);

  initRunning(context);
  registerWorkSpace(context);
}
module.exports = {
  activate,
}
