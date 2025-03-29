const { ServiceWebviewProvider } = require('../../webview/Service/ServiceWebviewProvider');

async function handleScanAfterSave(context) {
  const ServiceWebview = context.subscriptions.find(
    (subscription) => subscription instanceof ServiceWebviewProvider
  );
  if (ServiceWebview instanceof ServiceWebviewProvider) {
    ServiceWebview.refresh();
  }

}

module.exports = {
  handleScanAfterSave
};
