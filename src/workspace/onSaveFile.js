const vscode = require('vscode');
const yml = require('js-yaml');
const { processServiceFile, processRoutingFile } = require('../services/scanWorkspace');
const { refreshServiceTree, refreshRoutingTree, isSeviceYamlDocument, isRoutingYamlDocument } = require('../workspace/utilities');

/**
 * Watches for YAML file saves and refreshes the appropriate trees
 * @param {vscode.ExtensionContext} context Extension context
 */
function onSaveFile(context) {
  const disposable = vscode.workspace.onDidSaveTextDocument(handleDocumentSave.bind(null, context));
  context.subscriptions.push(disposable);
}

/**
 * Handles document save events
 * @param {vscode.ExtensionContext} context
 * @param {vscode.TextDocument} document
 */
function handleDocumentSave(context, document) {
  if (isSeviceYamlDocument(document)) {
    updateStateAndRefreshTree(context, document, 'services', processServiceFile, refreshServiceTree);
  } else if (isRoutingYamlDocument(document)) {
    updateStateAndRefreshTree(context, document, 'routing', processRoutingFile, refreshRoutingTree);
  }
}

/**
 * Updates the state and refreshes the tree for a given document type
 * @param {vscode.ExtensionContext} context
 * @param {vscode.TextDocument} document
 * @param {string} stateKey The key to use in workspaceState
 * @param {Function} processFunction The function to process the file
 * @param {Function} refreshFunction The function to refresh the tree
 */
function updateStateAndRefreshTree(context, document, stateKey, processFunction, refreshFunction) {
  // Get the original items and filter out the current file
  const originalItems = context.workspaceState.get(stateKey) || [];
  const updatedItems = originalItems.filter(item => item.file !== document.uri.fsPath);

  // Load and process the YAML file
  const fileContent = yml.load(document.getText());
  const processResult = processFunction(fileContent, document.uri.fsPath);

  // Extract the items from the process result
  // For services, the key is 'services', for routing, it's 'routings'
  const newItems = processResult[stateKey === 'routing' ? 'routing' : 'services'];

  // Add the new items to the updated list
  updatedItems.push(...newItems);

  // Sort the items alphabetically by label
  const sortedItems = [...updatedItems].sort((a, b) => {
    if (typeof a.label === 'string' && typeof b.label === 'string') {
      return a.label.localeCompare(b.label);
    }
    return 0;
  });

  // Update the state and refresh the tree
  context.workspaceState.update(stateKey, sortedItems);
  refreshFunction(context);
}

module.exports = {
  onSaveFile
};
