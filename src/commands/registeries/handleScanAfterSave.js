const { ServiceWebviewProvider } = require('../../webview/Service/ServiceWebviewProvider');
const { RoutingWebviewProvider } = require('../../webview/Routing/RoutingWebviewProvider');
const ServiceCompletion = require('../../completion/serviceCompletion');
const RoutingCompletion = require('../../completion/routingCompletion');
const { scan } = require('../../services/scanWorkspace');

async function handleScanAfterSave(context) {
  const ServiceWebview = context.subscriptions.find(
    (subscription) => subscription instanceof ServiceWebviewProvider
  );
  const RoutingWebview = context.subscriptions.find(
    (subscription) => subscription instanceof RoutingWebviewProvider
  );

  if (ServiceWebview instanceof ServiceWebviewProvider) {
    await scan(context, 'services');
    ServiceWebview.refresh();
  }
  await new ServiceCompletion(context).register();

  if (RoutingWebview instanceof RoutingWebviewProvider) {
    await scan(context, 'routing');
    RoutingWebview.refresh();
  }
  await new RoutingCompletion(context).register();

}

module.exports = {
  handleScanAfterSave
};
