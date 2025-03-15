const vscode = require("vscode");

const { commandMachineNames } = require('../constants');
const { handleScan } = require('./registeries/handleScan');
const { handleOpenFile } = require('./registeries/handleOpenfile');
const { handleServiceReload } = require('./registeries/handleServiceReload');
const { handleScanAfterSave } = require('./registeries/handleScanAfterSave');

/**
 * @param {vscode.ExtensionContext} context
 */
function registerCommands(context) {
  const commands = new Map([
    [commandMachineNames.scan, () => handleScan(context)],
    [commandMachineNames.openFile, (filePath, serviceId) => handleOpenFile(filePath, serviceId)],
    [commandMachineNames.serviceReload, () => handleServiceReload(context)],
    [commandMachineNames.scanAfterSave, (...args) => handleScanAfterSave(...args,context)],
  ]);

  commands.forEach((handler, commandMachineName) => {
    const disposable = vscode.commands.registerCommand(commandMachineName, handler);
    context.subscriptions.push(disposable);
  });
}

module.exports = {
  registerCommands
}
