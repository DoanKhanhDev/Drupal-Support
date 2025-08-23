const vscode = require('vscode');

class RoutingCompletion {
  constructor (context) {
    this.context = context;
  }

  async register() {
    // Get routing from workspace state
    const routings = await this.context.workspaceState.get('routing') || [];

    // Create completion items from routings
    const routingCompletionItems = this.createRoutingCompletionItems(routings);

    // Dispose existing completion providers if they exist
    ['phpRoutingCompletionProvider', 'yamlRoutingCompletionProvider'].forEach((provider) => {
      if (this.context.subscriptions[provider]) {
      this.context.subscriptions[provider].dispose();
      }
    });

    // Register completion providers
    this.registerPhpCompletionProvider(routingCompletionItems);
    this.registerTwigCompletionProvider(routingCompletionItems);
  }

  createRoutingCompletionItems(routings) {
    return routings.map(routing => ({
      label: routing.routingId,
      detail: routing.path ? routing.path : '',
      insertText: routing.routingId,
      filterText: routing.routingId,
      kind: vscode.CompletionItemKind.Class,
    }));
  }

  registerPhpCompletionProvider(completionItems) {
    const phpPrefixes = [
      'fromRoute(',
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

          if (!phpPrefixes.some((prefix) => linePrefix.includes(prefix) && (linePrefix.endsWith("('") || linePrefix.endsWith('("')))) {
            return [];
          }

          return completionItems;
        },
      },
      '"',
      "'"
    );

    this.context.subscriptions['phpRoutingCompletionProvider'] = phpCompletionProvider;
  }

  registerTwigCompletionProvider(completionItems) {
    const twigPrefixes = [
      'path(',
    ];
    const yamlCompletionProvider = vscode.languages.registerCompletionItemProvider(
      {
        language: 'twig',
        scheme: 'file',
        pattern: '**/*.html.twig',
      },
      {
        provideCompletionItems(document, position) {
          const linePrefix = document
            .lineAt(position)
            .text.substring(0, position.character);

          if (!twigPrefixes.some((prefix) => linePrefix.includes(prefix) && (linePrefix.endsWith("('") || linePrefix.endsWith('("')))) {
            return [];
          }

          return completionItems;
        },
      },
      '"',
      "'"
    );

    this.context.subscriptions['yamlRoutingCompletionProvider'] = yamlCompletionProvider;
  }
}

module.exports = RoutingCompletion;
