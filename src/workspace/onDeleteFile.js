const vscode = require('vscode');
const { refreshServiceTree, refreshRoutingTree, isSeviceYamlDocument, isRoutingYamlDocument } = require('./utilities');

/**
 * Watches for YAML file deletions and refreshes the appropriate trees
 * @param {vscode.ExtensionContext} context Extension context
 */
function onDeleteFile(context) {
  const disposable = vscode.workspace.onDidDeleteFiles(handleDocumentDelete.bind(null, context));
  context.subscriptions.push(disposable);
}

/**
 * Handles file deletion events
 * @param {vscode.ExtensionContext} context
 * @param {vscode.FileDeleteEvent} event
 */
function handleDocumentDelete(context, event) {
  let servicesUpdated = false;
  let routingUpdated = false;

  event.files.forEach(document => {
    const documentPath = document.fsPath;

    if (isSeviceYamlDocument(document)) {
      // Get current services and filter out the deleted one
      const services = context.workspaceState.get('services') || [];
      const updatedServices = services.filter(service => service.file !== documentPath);

      // Update services state if there was a change
      if (services.length !== updatedServices.length) {
        context.workspaceState.update('services', updatedServices);
        servicesUpdated = true;
      }
    } else if (isRoutingYamlDocument(document)) {
      // Get current routing and filter out the deleted one
      const routing = context.workspaceState.get('routing') || [];
      const updatedRouting = routing.filter(route => route.file !== documentPath);

      // Update routing state if there was a change
      if (routing.length !== updatedRouting.length) {
        context.workspaceState.update('routing', updatedRouting);
        routingUpdated = true;
      }
    }
  });

  // Only refresh trees if needed
  if (servicesUpdated) {
    refreshServiceTree(context);
  }

  if (routingUpdated) {
    refreshRoutingTree(context);
  }
}

module.exports = {
  onDeleteFile
};
