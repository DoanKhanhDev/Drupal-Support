const vscode = require('vscode');

class ServiceCompletion {
  constructor(context) {
    this.context = context;
  }

  async register() {
    // Get services from workspace state
    const services = await this.context.workspaceState.get('services') || [];

    // Create completion items from services
    const serviceCompletionItems = this.createServiceCompletionItems(services);

    // Dispose existing completion providers if they exist
    ['phpServiceCompletionProvider', 'yamlServiceCompletionProvider'].forEach((provider) => {
      if (this.context.subscriptions[provider]) {
      this.context.subscriptions[provider].dispose();
      }
    });

    // Register completion providers
    this.registerPhpCompletionProvider(serviceCompletionItems);
    this.registerYamlCompletionProvider(serviceCompletionItems);
  }

  createServiceCompletionItems(services) {
    return services.map(service => ({
      label: service.label,
      detail: service.class,
      insertText: service.serviceId,
      filterText: service.serviceId,
      kind: vscode.CompletionItemKind.Class,
    }));
  }

  registerPhpCompletionProvider(completionItems) {
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

          if (!phpPrefixes.some((prefix) => linePrefix.includes(prefix) && (linePrefix.endsWith("('") || linePrefix.endsWith('("')) )) {
            return [];
          }

          return completionItems;
        },
      },
      '"',
      "'"
    );

    this.context.subscriptions['phpServiceCompletionProvider'] = phpCompletionProvider;
  }

  registerYamlCompletionProvider(completionItems) {
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

    this.context.subscriptions['yamlRoutingCompletionProvider'] = yamlCompletionProvider;
  }
}

module.exports = ServiceCompletion;
