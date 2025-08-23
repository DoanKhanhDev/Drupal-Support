const vscode = require('vscode');
const { RoutingWebviewProvider } = require('../../webview/Routing/RoutingWebviewProvider');
const { scan } = require('../../services/scanWorkspace');
const RoutingCompletion = require('../../completion/routingCompletion');

/**
 * Reloads the service tree view
 * @param {vscode.ExtensionContext} context
 * @returns {Promise<void>}
 */
async function handleRoutingReload(context) {
  try {
    const routingWebview = context.subscriptions.find(
      subscription => subscription instanceof RoutingWebviewProvider
    );

    if (!routingWebview) {
      vscode.window.showErrorMessage('Routing provider not found');
      return;
    }

    await scan(context, 'routing');
    await routingWebview.refresh();
    await new RoutingCompletion(context).register();

    // Show message in status bar that disappears after 3 seconds
    const statusBarMessage = vscode.window.setStatusBarMessage('Routings reloaded successfully');
    setTimeout(() => {
      statusBarMessage.dispose();
    }, 3000);

  } catch (error) {
    vscode.window.showErrorMessage(`Failed to reload routings`);
  }
}

module.exports = {
  handleRoutingReload,
};
