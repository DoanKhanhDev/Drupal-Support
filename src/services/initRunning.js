const vscode = require("vscode");
const { commandMachineNames } = require('../constants');
const { ServiceWebviewProvider } = require('../webview/ServiceWebviewProvider');

async function initRunning(context) {
  await vscode.commands.executeCommand(commandMachineNames.scan);
  const webviewProvider = new ServiceWebviewProvider(context);
  vscode.window.registerWebviewViewProvider(
    'drupal-support.serviceWebview',
    webviewProvider
  );
  context.subscriptions.push(webviewProvider);
}

module.exports = {
  initRunning,
};
