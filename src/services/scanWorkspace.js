const vscode = require('vscode');
const yaml = require('js-yaml');
const fs = require('fs');
const { excludePattern } = require('../constants');

/**
 * Processes a Drupal service YAML file and extracts service definitions
 * @param {Object} fileContent - Parsed YAML content
 * @param {string} filePath - Path to the file
 * @returns {Object} Object containing array of service definitions
 */
const processServiceFile = (fileContent, filePath) => {
  const services = [];

  if (!(fileContent && fileContent.services instanceof Object)) {
    return { services };
  }

  Object.entries(fileContent.services).forEach(([serviceId, serviceData]) => {
    // Skip defaults and namespaced services
    if (serviceId === '_defaults' || serviceId.includes('\\')) {
      return;
    }

    services.push({
      label: serviceId,
      serviceId,
      class: serviceData.class,
      tag: serviceData.tags,
      file: filePath,
    });
  });

  return { services };
};

/**
 * Processes a Drupal routing YAML file and extracts route definitions
 * @param {Object} fileContent - Parsed YAML content
 * @param {string} filePath - Path to the file
 * @returns {Object} Object containing array of route definitions
 */
const processRoutingFile = (fileContent, filePath) => {
  const routing = [];

  if (!fileContent) {
    return { routing };
  }

  Object.entries(fileContent).forEach(([routingId, routingData]) => {
    let handler = '';

    if (routingData.defaults) {
      handler = routingData.defaults._controller ||
        routingData.defaults._form ||
        routingData.defaults._entity_form ||
        '';
    };

    routing.push({
      label: routingId.replace('<', '&lt;').replace('>', '&gt;'),
      routingId,
      handler,
      path: routingData.path,
      file: filePath,
    });
  });

  return { routing };
};

/**
 * Safely reads and parses a YAML file
 * @param {string} filePath - Path to the YAML file
 * @returns {Object|null} Parsed YAML content or null if error
 */
const readYamlFile = (filePath) => {
  try {
    const content = fs.readFileSync(filePath, "utf-8");
    return yaml.load(content);
  } catch (error) {
    return null;
  }
};

/**
 * Sorts an array of objects by their label property
 * @param {Array} items - Array of objects with label property
 * @returns {Array} Sorted array
 */
const sortByLabel = (items) => {
  return [...items].sort((a, b) => {
    if (typeof a.label === 'string' && typeof b.label === 'string') {
      return a.label.localeCompare(b.label);
    }
    return 0;
  });
};

/**
 * Processes a batch of files with the given processor function
 * @param {Array} files - Array of file URIs
 * @param {Function} processor - Function to process each file
 * @returns {Promise<Array>} Combined results from all files
 */
const processFiles = async (files, processor) => {
  const results = [];

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const fileContent = readYamlFile(file.path);

    if (fileContent) {
      const processed = processor(fileContent, file.path);
      results.push(...Object.values(processed)[0]);
    }
  }

  return results;
};

async function scanServices(context) {
  const serviceFiles = await vscode.workspace.findFiles('**/*.services.yml', excludePattern);
  // Process service files
  const allServices = await processFiles(
    serviceFiles,
    processServiceFile,);

  // Sort results and update workspace state
  const sortedServices = sortByLabel(allServices);
  await context.workspaceState.update('services', sortedServices);
}

async function scanRouting(context) {
  const routingFiles = await vscode.workspace.findFiles('**/*.routing.yml', excludePattern);
  // Process routing files
  const allRoutingFiles = await processFiles(
    routingFiles,
    processRoutingFile,
  );

  // Sort results and update workspace state
  const sortedRouting = sortByLabel(allRoutingFiles);

  await context.workspaceState.update('routing', sortedRouting)
}


/**
 * Scans the workspace for Drupal service and routing files
 * @param {vscode.ExtensionContext} context - VS Code extension context
 * @param {string} type - Type of scan (services or routing)
 */
async function scan(context, type) {
  try {
    switch (type) {
      case 'services':
        await scanServices(context);
        break;
      case 'routing':
        await scanRouting(context);
        break;
      default:
        await scanServices(context);
        await scanRouting(context);
    }
  } catch (error) {
    vscode.window.showInformationMessage(`Error scanning Drupal workspace`);
  }
}

module.exports = { scan, processServiceFile, processRoutingFile };
