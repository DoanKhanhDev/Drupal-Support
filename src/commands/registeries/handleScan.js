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
  try {
    await scan(context, type);
  } catch (error) {
    // Handle errors
  }
}

module.exports = {
  handleScan
};
