const vscode = require("vscode");
const { scan } = require("../../services/scanWorkspace");

/**
 * Handles the scanning of Drupal services in the workspace with progress indication
 * @param {vscode.ExtensionContext} context - The VS Code extension context
 * @param  {string} type - The type of scan to perform (services or routings)
 * @returns {Promise<void>} A promise that resolves when scanning is complete
 * @throws {Error} When scanning operation fails
 */
async function handleScan(context, type = 'all') {
  const progressOptions = {
    location: vscode.ProgressLocation.Notification,
    title: "Drupal Support Scanning",
    cancellable: true
  };

  try {
    await vscode.window.withProgress(progressOptions, async (progress, token) => {
      // Setup cancellation handler
      token.onCancellationRequested(() => {
        vscode.window.showInformationMessage('Scan operation cancelled');
        return;
      });

      progress.report({ message: 'Starting scan...' });
      await scan(progress, token, context, type);
    });
  } catch (error) {
    // Handle errors
  }
}

module.exports = {
  handleScan
};
