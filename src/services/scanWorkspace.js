const vscode = require('vscode');
const yaml = require('js-yaml');
const fs = require('fs');

const processServiceFile = (fileContent, filePath) => {
  const services = [];

  if (!(fileContent && fileContent.services instanceof Object)) {
    return { services };
  }

  Object.entries(fileContent.services).forEach(([serviceId, serviceData]) => {
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
async function scan(progress, token, context) {
  const files = await vscode.workspace.findFiles(
    '**/*.services.yml',
    '**/{vendor,node_modules,test,tests,.git,.idea,.vscode}/**',
  );

  progress.report({ message: `Found ${files.length} services files` });

  const allServices = [];

  for (let i = 0; i < files.length; i++) {
    const fileContent = yaml.load(fs.readFileSync(files[i].path, "utf-8"));
    const { services } = processServiceFile(fileContent, files[i].path);

    allServices.push(...services);

    progress.report({
      message: `Processing (${i + 1}/${files.length})`,
    });
  }

  const sortedServices = [...allServices].sort((a, b) => {
    if (typeof a.label === 'string' && typeof b.label === 'string') {
      return a.label.localeCompare(b.label)
    }
    return 0;
  });

  await context.workspaceState.update('services', sortedServices);
}

module.exports = { scan, processServiceFile };
