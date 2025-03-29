const vscode = require('vscode');
const { RoutingWebviewProvider } = require('../../webview/Routing/RoutingWebviewProvider');
const { ServiceWebviewProvider } = require('../../webview/Service/ServiceWebviewProvider');

/**
 * Reloads the service tree view
 * @param {vscode.ExtensionContext} context
 * @returns {Promise<void>}
 */
async function handleAllReload(context) {
  try {
    const routingWebview = context.subscriptions.find(
      subscription => subscription instanceof RoutingWebviewProvider
    );

    const serviceWebview = context.subscriptions.find(
      subscription => subscription instanceof ServiceWebviewProvider
    );

    if (!routingWebview) {
      vscode.window.showErrorMessage('Routing provider not found');
      return;
    }

    if (!serviceWebview) {
      vscode.window.showErrorMessage('Service provider not found');
      return;
    }

    await routingWebview.refresh();
    await serviceWebview.refresh();

    // Show message in status bar that disappears after 3 seconds
    const statusBarMessage = vscode.window.setStatusBarMessage('Reloaded successfully');
    setTimeout(() => {
      statusBarMessage.dispose();
    }, 3000);

  } catch (error) {
    vscode.window.showErrorMessage(`Failed to reload`);
  }
}

module.exports = {
  handleAllReload,
};
