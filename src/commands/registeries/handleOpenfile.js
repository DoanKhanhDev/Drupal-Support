const vscode = require('vscode');

class FileHighlighter {
  /**
   * Creates a new FileHighlighter instance to manage text decorations
   */
  constructor() {
    this.decoration = null;
  }

  /**
   * Clears any existing text decorations
   */
  clearDecorations() {
    if (this.decoration) {
      this.decoration.dispose();
      this.decoration = null;
    }
  }

  /**
   * Creates a new text editor decoration type for highlighting
   * @returns {vscode.TextEditorDecorationType} The created decoration type
   */
  createHighlightDecoration() {
    return vscode.window.createTextEditorDecorationType({
      backgroundColor: new vscode.ThemeColor('editor.selectionBackground'),
      isWholeLine: false,
      rangeBehavior: vscode.DecorationRangeBehavior.ClosedClosed
    });
  }

  /**
   * Applies highlighting to specified ranges in the editor
   * @param {vscode.TextEditor} editor - The active text editor
   * @param {vscode.Range[]} ranges - Array of ranges to highlight
   */
  highlightRanges(editor, ranges) {
    this.clearDecorations();
    this.decoration = this.createHighlightDecoration();
    editor.setDecorations(this.decoration, ranges);
    editor.revealRange(ranges[0], vscode.TextEditorRevealType.InCenter);
  }
}

class ServiceLocator {
  /**
   * Finds all occurrences of a service ID in the document
   * @param {vscode.TextDocument} document - The document to search in
   * @param {string} serviceId - The service ID to search for
   * @returns {vscode.Range[]} Array of ranges where the service ID was found
   */
  static findServiceRanges(document, serviceId) {
    const searchString = `${serviceId}:`;
    const text = document.getText();
    const ranges = [];
    let startIndex = 0;

    while ((startIndex = text.indexOf(searchString, startIndex)) !== -1) {
      ranges.push(new vscode.Range(
        document.positionAt(startIndex),
        document.positionAt(startIndex + searchString.length)
      ));
      startIndex += searchString.length;
    }

    return ranges;
  }
}

const fileHighlighter = new FileHighlighter();

/**
 * Handles opening a file and highlighting service ID occurrences
 * @param {string} filePath - Path to the file to open
 * @param {string} serviceId - Service ID to search and highlight
 * @returns {Promise<void>}
 */
async function handleOpenFile(filePath, serviceId) {
  if (!filePath || !serviceId) {
    vscode.window.showWarningMessage('File path and service ID are required');
    return;
  }

  try {
    const document = await vscode.workspace.openTextDocument(filePath);
    const editor = await vscode.window.showTextDocument(document);

    const ranges = ServiceLocator.findServiceRanges(document, serviceId);

    if (ranges.length === 0) {
      vscode.window.showInformationMessage(`No occurrences of "${serviceId}:" found`);
      return;
    }

    fileHighlighter.highlightRanges(editor, ranges);

  } catch (error) {
    vscode.window.showErrorMessage(`Failed to open file: ${error.message}`);
  }
}

module.exports = {
  handleOpenFile
};
