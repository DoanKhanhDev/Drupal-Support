const vscode = require("vscode");
const { commandMachineNames } = require('../constants');
const { ServiceWebviewProvider } = require('../webview/Service/ServiceWebviewProvider');
const { RoutingWebviewProvider } = require('../webview/Routing/RoutingWebviewProvider');

async function initRunning(context) {
  await vscode.commands.executeCommand(commandMachineNames.scan);
  const serviceWebviewProviderInstance = new ServiceWebviewProvider(context);
  const routingWebviewProviderInstance = new RoutingWebviewProvider(context);
  vscode.window.registerWebviewViewProvider(
    'drupal-support.serviceWebview',
    serviceWebviewProviderInstance
  );
  vscode.window.registerWebviewViewProvider(
    'drupal-support.routingWebview',
    routingWebviewProviderInstance
  );
  context.subscriptions.push(serviceWebviewProviderInstance, routingWebviewProviderInstance);
}

module.exports = {
  initRunning,
};
