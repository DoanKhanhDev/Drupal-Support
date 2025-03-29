const vscode = require('vscode');
const { ServiceWebviewProvider } = require('../webview/Service/ServiceWebviewProvider');
const { RoutingWebviewProvider } = require('../webview/Routing/RoutingWebviewProvider');

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
 * Refreshes the service tree if available
 * @param {vscode.ExtensionContext} context
 */
function refreshRoutingTree(context) {
  const RoutingWebview = context.subscriptions.find(
    (subscription) => subscription instanceof RoutingWebviewProvider
  );
  if (RoutingWebview instanceof  RoutingWebviewProvider) {
    RoutingWebview.refresh();
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

/**
 * Checks if document is YAML
 * @param {vscode.TextDocument|vscode.Uri} document
 * @returns {boolean}
 */
function isRoutingYamlDocument(document) {
  if (document instanceof vscode.Uri) {
    return document.fsPath.endsWith('.routing.yml');
  }
  return document.languageId === 'yaml' && document.fileName.endsWith('.routing.yml');
}


module.exports = {
  refreshServiceTree,
  refreshRoutingTree,
  isSeviceYamlDocument,
  isRoutingYamlDocument
};
