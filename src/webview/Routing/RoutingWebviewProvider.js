const vscode = require('vscode');
const { getWebviewStyles } = require('./styles');
const { getWebviewScripts } = require('./scripts');
const { commandMachineNames } = require('../../constants');

class RoutingWebviewProvider {
  constructor (context) {
    this._view = null;
    this.context = context;
    this.routings = context.workspaceState.get('routing') || [];
    this.filteredRoutings = this.routings;
    this.collapsedSections = {
      core: false,
      modules: false
    };
  }

  resolveWebviewView(webviewView) {
    this._view = webviewView;
    webviewView.webview.options = {
      enableScripts: true
    };

    // Initial render with full HTML
    this._view.webview.html = this.getInitialHtml();

    webviewView.webview.onDidReceiveMessage(message => this.handleMessage(message));
  }

  handleMessage(message) {
    switch (message.command) {
      case 'openFile':
        let routingId = message.routingId;
        if (message.routingId.includes('<') || message.routingId.includes('>')) {
          routingId = "'" + message.routingId + "'";
        }
        vscode.commands.executeCommand(commandMachineNames.openFile, message.file, routingId);
        break;
      case 'refresh':
        this.refresh();
        break;
      case 'search':
        this.searchRoutings(message.searchTerm);
        break;
      case 'toggleSection':
        this.toggleSection(message.section);
        break;
    }
  }

  toggleSection(section) {
    this.collapsedSections[section] = !this.collapsedSections[section];
    this.updateContent();
  }

  getInitialHtml() {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <style>${getWebviewStyles()}</style>
        </head>
        <body>
          <div class="container">
            <div class="search-container">
              <input type="text" class="search-box" placeholder="Search routings or paths..." />
            </div>
            <div id="routings-list">
              ${this.getRoutingsListHtml()}
            </div>
          </div>
          <script>${getWebviewScripts()}</script>
        </body>
      </html>
    `;
  }

  getRoutingsListHtml() {
    const routings = this.filteredRoutings;
    const coreRoutings = this.filterCoreRouting(routings);
    const moduleRoutings = this.filterModuleRouting(routings);

    return `
      ${routings.length === 0 ? '<div class="no-results">No routings found or this isn\'t Drupal Workspace</div>' : ''}
      ${this.renderSectionHtml('core', 'Core Routings', coreRoutings)}
      ${this.renderSectionHtml('modules', 'Module Routings', moduleRoutings)}
    `;
  }

  filterCoreRouting(routings) {
    return routings.filter(routing => routing.file.includes('/core/'));
  }

  filterModuleRouting(routings) {
    return routings.filter(routing => !routing.file.includes('/core/'));
  }

  renderSectionHtml(sectionClass, title, routings) {
    if (routings.length === 0) return '';

    return `
      <div class="section ${sectionClass}">
        <div class="section-title">
          <span>${title} (${routings.length})</span>
          <div class="toggle-icon ${this.collapsedSections[sectionClass] ? 'collapsed' : 'expanded'}"></div>
        </div>
        <div class="section-content ${this.collapsedSections[sectionClass] ? 'collapsed' : ''}">
          ${this.renderRoutings(routings)}
        </div>
      </div>
    `;
  }

  updateContent() {
    if (this._view) {
      // Only update the routings list content
      this._view.webview.postMessage({
        type: 'updateList',
        html: this.getRoutingsListHtml()
      });
    }
  }

  renderRoutings(routings) {
    return routings.map(routing => `
      <div class="routing-item"
           data-file="${routing.file}"
           data-routing-id="${routing.routingId}">
        <span>${routing.label}</span>
        <div class="routing-actions">
          <div class="action-button copy" data-action="copy" data-value="${routing.label}" title="Copy routing name"></div>
        </div>
      </div>
    `).join('');
  }

  async refresh() {
    this.routings = this.context.workspaceState.get('routing') || [];
    this.filteredRoutings = this.routings;
    this.updateContent();
  }

  searchRoutings(searchTerm) {
    this.filteredRoutings = searchTerm
      ? this.routings.filter(routing =>
        routing.label.toLowerCase().includes(searchTerm.toLowerCase())
        || (routing.path && routing.path.toLowerCase().includes(searchTerm.toLowerCase())))
      : this.routings;

    this.updateContent();
  }
}

module.exports = {
  RoutingWebviewProvider
};
