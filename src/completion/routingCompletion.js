const vscode = require('vscode');

/**
 * Registers service completion providers for PHP and YAML files
 * @param {vscode.ExtensionContext} context - The extension context
 */
async function routingCompletion(context) {
  // Get routing from workspace state
  const routings = await context.workspaceState.get('routing') || [];

  // Create completion items from routings
  const routingCompletionItems = createRoutingCompletionItems(routings);

  // Register completion providers
  registerPhpCompletionProvider(context, routingCompletionItems);
  registerTwigCompletionProvider(context, routingCompletionItems);
}

/**
 * Creates completion items from service data
 * @param {Array} routings - Array of service objects
 * @returns {Array} - Array of completion items
 */
function createRoutingCompletionItems(routings) {
  return routings.map(routing => ({
    label: routing.routingId,
    detail: routing.path ? routing.path : '',
    insertText: routing.routingId,
    filterText: routing.routingId,
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

  context.subscriptions.push(phpCompletionProvider);
}


/**
 * Registers YAML completion provider
 * @param {vscode.ExtensionContext} context - The extension context
 * @param {Array} completionItems - Array of completion items
 */
function registerTwigCompletionProvider(context, completionItems) {
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

  context.subscriptions.push(yamlCompletionProvider);
}


module.exports = {
  routingCompletion
}
