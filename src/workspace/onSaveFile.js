const vscode = require('vscode');
const yml = require('js-yaml');
const { processServiceFile } = require('../services/scanWorkspace');
const { refreshServiceTree, isSeviceYamlDocument } = require('../workspace/utilities');

/**
 * Watches for YAML file saves and refreshes the service tree
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
  if (!isSeviceYamlDocument(document)) {
    return;
  }

  // Remove the service from the serviceOriginal array if it exists.
  const serviceOriginal = context.workspaceState.get('services') || [];
  const serviceUpdated = serviceOriginal.filter(service => service.file !== document.uri.fsPath);

  // Load the YAML file.
  const fileContent = yml.load(document.getText());
  const { services } = processServiceFile(fileContent, document.uri.fsPath);

  // Update the serviceOriginal array with the new services.
  serviceUpdated.push(...services);

  // Sort the services alphabetically by label.
  const sortedServices = [...serviceUpdated].sort((a, b) => {
    if (typeof a.label === 'string' && typeof b.label === 'string') {
      return a.label.localeCompare(b.label)
    }
    return 0;
  });

  // Update the serviceOriginal array with the sorted services.
  context.workspaceState.update('services', sortedServices);
  refreshServiceTree(context);
}

module.exports = {
  onSaveFile
};
