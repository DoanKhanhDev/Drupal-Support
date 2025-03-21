const vscode = require('vscode');

/**
 * Registers service completion providers for PHP and YAML files
 * @param {vscode.ExtensionContext} context - The extension context
 */
async function serviceCompletion(context) {
  // Get services from workspace state
  const services = await context.workspaceState.get('services') || [];

  // Create completion items from services
  const serviceCompletionItems = createServiceCompletionItems(services);

  // Register completion providers
  registerPhpCompletionProvider(context, serviceCompletionItems);
  registerYamlCompletionProvider(context, serviceCompletionItems);
}

/**
 * Creates completion items from service data
 * @param {Array} services - Array of service objects
 * @returns {Array} - Array of completion items
 */
function createServiceCompletionItems(services) {
  return services.map(service => ({
    label: service.label,
    detail: service.class,
    insertText: service.serviceId,
    filterText: service.serviceId,
    kind: vscode.CompletionItemKind.Class,
  }));
}

/**
 * Registers PHP completion provider
 * @param {vscode.ExtensionContext} context - The extension context
 * @param {Array} completionItems - Array of completion items
 */
function registerPhpCompletionProvider(context, completionItems) {
  const phpPrefixes = [
    'Drupal::service(',
    '$container->get(',
    '$container->getDefinition(',
  ];

  const phpCompletionProvider = vscode.languages.registerCompletionItemProvider(
    {
      language: 'php',
      scheme: 'file',
    },
    {
      provideCompletionItems(document, position) {
        const linePrefix = document
          .lineAt(position)
          .text.substring(0, position.character);

        if (!phpPrefixes.some((prefix) => linePrefix.includes(prefix))) {
          return [];
        }

        return completionItems;
      },
    },
    '"',
    "'"
  );

  context.subscriptions.push(phpCompletionProvider);
}

/**
 * Registers YAML completion provider
 * @param {vscode.ExtensionContext} context - The extension context
 * @param {Array} completionItems - Array of completion items
 */
function registerYamlCompletionProvider(context, completionItems) {
  const yamlCompletionProvider = vscode.languages.registerCompletionItemProvider(
    {
      language: 'yaml',
      scheme: 'file',
      pattern: '**/*.services.yml',
    },
    {
      provideCompletionItems(document, position) {
        const linePrefix = document
          .lineAt(position)
          .text.substring(0, position.character);

        if (!linePrefix.includes('@')) {
          return [];
        }

        return completionItems;
      },
    },
    '@'
  );

  context.subscriptions.push(yamlCompletionProvider);
}

module.exports = {
  serviceCompletion
}
