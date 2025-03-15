const vscode = require('vscode');
const { ServiceWebviewProvider } = require('../webview/ServiceWebviewProvider');

/**
 * Refreshes the service tree if available
 * @param {vscode.ExtensionContext} context
 */
function refreshServiceTree(context) {
  const ServiceWebview = context.subscriptions.find(
    (subscription) => subscription instanceof ServiceWebviewProvider
  );
  if (ServiceWebview instanceof  ServiceWebviewProvider) {
    ServiceWebview.refresh();
  }
}

/**
 * Checks if document is YAML
 * @param {vscode.TextDocument|vscode.Uri} document
 * @returns {boolean}
 */
function isSeviceYamlDocument(document) {
  if (document instanceof vscode.Uri) {
    return document.fsPath.endsWith('.services.yml');
  }
  return document.languageId === 'yaml' && document.fileName.endsWith('.services.yml');
}


module.exports = {
  refreshServiceTree,
  isSeviceYamlDocument
};
