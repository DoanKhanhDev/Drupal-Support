const vscode = require('vscode');
const { refreshServiceTree, isSeviceYamlDocument } = require('./utilities');

/**
 * Watches for YAML file saves and refreshes the service tree
 * @param {vscode.ExtensionContext} context Extension context
 */
function onDeleteFile(context) {
  const disposable = vscode.workspace.onDidDeleteFiles(handleDocumentDelete.bind(null, context));
  context.subscriptions.push(disposable);
}

/**
 * Handles document save events
 * @param {vscode.ExtensionContext} context
 * @param {vscode.FileDeleteEvent} documents
 */
function handleDocumentDelete(context, documents) {
  const serviceOriginal = context.workspaceState.get('services') || [];
  documents.files.forEach(document => {
    if (!isSeviceYamlDocument(document)) {
      return;
    }
    // Remove the service from the serviceOriginal array if it exists.
    const serviceUpdated = serviceOriginal.filter(service => service.file !== document.fsPath);

    // Update the serviceOriginal array with the sorted services.
    context.workspaceState.update('services', serviceUpdated);
  });

  refreshServiceTree(context);
}

module.exports = {
  onDeleteFile
};
