function getWebviewStyles() {
  return `
    body {
      padding: 0;
      margin: 0;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    }
    .container {
      padding: 12px;
    }
    .search-container {
      position: sticky;
      top: 0;
      background: var(--vscode-editor-background);
      margin: 12px;
      z-index: 100;
    }
    .search-box {
      width: 100%;
      padding: 8px;
      background: var(--vscode-input-background);
      color: var(--vscode-input-foreground);
      border: 1px solid var(--vscode-input-border);
      border-radius: 4px;
      font-size: 13px;
      transition: border-color 0.2s;
      display: block;
    }
    .search-box:focus {
      outline: none;
      border-color: var(--vscode-focusBorder);
    }
    .section {
      margin-bottom: 20px;
    }
    .section-title {
      padding: 6px 12px;
      font-weight: 600;
      font-size: 13px;
      color: var(--vscode-foreground);
      display: flex;
      align-items: center;
      gap: 6px;
      cursor: pointer;
      user-select: none;
    }
    .section-title::before {
      content: '';
      display: inline-block;
      width: 16px;
      height: 16px;
      background-color: var(--vscode-foreground);
      mask-size: cover;
    }
    .core .section-title::before {
      mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath d='M7.5 1c-2.25.03-4.13.6-5.63 2.1C.38 4.6-.17 6.48-.14 8.73c.03 2.25.6 4.13 2.1 5.63 1.5 1.5 3.38 2.05 5.63 2.02 2.25-.03 4.13-.6 5.63-2.1 1.5-1.5 2.05-3.38 2.02-5.63-.03-2.25-.6-4.13-2.1-5.63C11.63 1.52 9.75.97 7.5 1zm0 1.5c1.88-.03 3.38.45 4.5 1.57 1.13 1.13 1.6 2.63 1.57 4.5-.03 1.88-.45 3.38-1.57 4.5-1.13 1.13-2.63 1.6-4.5 1.57-1.88-.03-3.38-.45-4.5-1.57-1.13-1.13-1.6-2.63-1.57-4.5.03-1.88.45-3.38 1.57-4.5 1.13-1.13 2.63-1.6 4.5-1.57z'/%3E%3C/svg%3E");
    }
    .modules .section-title::before {
      mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath d='M1.5 1h13l.5.5v13l-.5.5h-13l-.5-.5v-13l.5-.5zM2 2v12h12V2H2zm2 2h8v1H4V4zm0 3h8v1H4V7zm0 3h8v1H4v-1z'/%3E%3C/svg%3E");
    }
    .section-title .toggle-icon {
      margin-left: auto;
      width: 16px;
      height: 16px;
      background-color: var(--vscode-foreground);
      mask-size: cover;
      opacity: 0.7;
      transition: transform 0.2s;
    }
    .section-title .toggle-icon.expanded {
      mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath d='M7.976 10.072l4.357-4.357.62.618L8.284 11h-.618L3 6.333l.619-.618 4.357 4.357z'/%3E%3C/svg%3E");
      transform: rotate(0deg);
    }
    .section-title .toggle-icon.collapsed {
      mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath d='M7.976 10.072l4.357-4.357.62.618L8.284 11h-.618L3 6.333l.619-.618 4.357 4.357z'/%3E%3C/svg%3E");
      transform: rotate(-90deg);
    }
    .section-content {
      transition: max-height 0.3s ease-out;
      overflow: hidden;
    }
    .section-content.collapsed {
      max-height: 0;
    }
    .routing-item {
      padding: 8px 12px;
      margin: 4px 0;
      cursor: pointer;
      border-radius: 4px;
      font-size: 13px;
      display: flex;
      align-items: center;
      gap: 8px;
      color: var(--vscode-foreground);
      transition: background-color 0.1s;
    }

    .section-title span,
    .routing-item span {
      flex: 1;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .routing-item::before {
      content: '';
      display: inline-block;
      width: 14px;
      height: 14px;
      background-color: var(--vscode-foreground);
      mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath d='M4.5 3h7l.5.5v9l-.5.5h-7l-.5-.5v-9l.5-.5zM5 4v8h6V4H5zm1 2h4v1H6V6zm0 2h4v1H6V8z'/%3E%3C/svg%3E");
      mask-size: cover;
      opacity: 0.8;
    }
    .routing-item:hover {
      background: var(--vscode-list-hoverBackground);
    }
    .action-button {
      padding: 4px;
      border-radius: 4px;
      cursor: pointer;
      color: var(--vscode-foreground);
      opacity: 0.8;
      width: 16px;
      height: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    /* Add this new style for the copy button */
    .action-button.copy {
      background-color: var(--vscode-foreground);
      mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath d='M4 2h7v1H4V2zm7 1h1v10h-1V3zM4 2v1H3v10h1v1h7v-1H4v-1h7V3H4V2zm0 11H3v1h1v-1z'/%3E%3C/svg%3E");
      mask-size: cover;
      -webkit-mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath d='M4 2h7v1H4V2zm7 1h1v10h-1V3zM4 2v1H3v10h1v1h7v-1H4v-1h7V3H4V2zm0 11H3v1h1v-1z'/%3E%3C/svg%3E");
      -webkit-mask-size: cover;
    }

    .action-button:hover {
      opacity: 1;
      background-color: var(--vscode-button-hoverBackground);
    }

    .no-results {
      padding: 20px;
      text-align: center;
      color: var(--vscode-descriptionForeground);
      font-style: italic;
    }
  `;
}

module.exports = {
  getWebviewStyles
};
