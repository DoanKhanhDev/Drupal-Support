const commandMachineNames = {
  scan: 'drupal-support.scan',
  openFile: 'drupal-support.openFile',
  allReload: 'drupal-support.all.reload',
  serviceReload: 'drupal-support.service.reload',
  routingReload: 'drupal-support.routing.reload',
  scanAfterSave: 'drupal-support.service.scanAfterSave',
}

const excludePattern = '**/{vendor,node_modules,test,tests,.git,.idea,.vscode}/**';

module.exports = {
  commandMachineNames,
  excludePattern
}
