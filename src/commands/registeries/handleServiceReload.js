const vscode = require('vscode');
const { ServiceWebviewProvider } = require('../../webview/ServiceWebviewProvider');

/**
 * Reloads the service tree view
 * @param {vscode.ExtensionContext} context
 * @returns {Promise<void>}
 */
async function handleServiceReload(context) {
  try {
    const serviceWebview = context.subscriptions.find(
      subscription => subscription instanceof ServiceWebviewProvider
    );

    if (!serviceWebview) {
      vscode.window.showErrorMessage('Service provider not found');
      return;
    }

    await serviceWebview.refresh();


    // Show message in status bar that disappears after 3 seconds
    const statusBarMessage = vscode.window.setStatusBarMessage('Services reloaded successfully');
    setTimeout(() => {
      statusBarMessage.dispose();
    }, 3000);

  } catch (error) {
    vscode.window.showErrorMessage(`Failed to reload services`);
  }
}

module.exports = {
  handleServiceReload,

};
