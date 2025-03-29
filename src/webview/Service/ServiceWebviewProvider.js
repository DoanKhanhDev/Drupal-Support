const vscode = require('vscode');
const { getWebviewStyles } = require('./styles');
const { getWebviewScripts } = require('./scripts');
const { commandMachineNames } = require('../../constants');

class ServiceWebviewProvider {
  constructor(context) {
    this._view = null;
    this.context = context;
    this.services = context.workspaceState.get('services') || [];
    this.filteredServices = this.services;
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
        vscode.commands.executeCommand(commandMachineNames.openFile, message.file, message.serviceId);
        break;
      case 'refresh':
        this.refresh();
        break;
      case 'search':
        this.searchServices(message.searchTerm);
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
              <input type="text" class="search-box" placeholder="Search services..." />
            </div>
            <div id="services-list">
              ${this.getServicesListHtml()}
            </div>
          </div>
          <script>${getWebviewScripts()}</script>
        </body>
      </html>
    `;
  }

  getServicesListHtml() {
    const services = this.filteredServices;
    const coreServices = this.filterCoreServices(services);
    const moduleServices = this.filterModuleServices(services);

    return `
      ${services.length === 0 ? '<div class="no-results">No services found or this isn\'t Drupal Workspace</div>' : ''}
      ${this.renderSectionHtml('core', 'Core Services', coreServices)}
      ${this.renderSectionHtml('modules', 'Module Services', moduleServices)}
    `;
  }

  filterCoreServices(services) {
    return services.filter(service => service.file.includes('/core/'));
  }

  filterModuleServices(services) {
    return services.filter(service => !service.file.includes('/core/'));
  }

  renderSectionHtml(sectionClass, title, services) {
    if (services.length === 0) return '';

    return `
      <div class="section ${sectionClass}">
        <div class="section-title">
          <span>${title} (${services.length})</span>
          <div class="toggle-icon ${this.collapsedSections[sectionClass] ? 'collapsed' : 'expanded'}"></div>
        </div>
        <div class="section-content ${this.collapsedSections[sectionClass] ? 'collapsed' : ''}">
          ${this.renderServices(services)}
        </div>
      </div>
    `;
  }

  updateContent() {
    if (this._view) {
      // Only update the services list content
      this._view.webview.postMessage({
        type: 'updateList',
        html: this.getServicesListHtml()
      });
    }
  }

  renderServices(services) {
    return services.map(service => `
      <div class="service-item"
           data-file="${service.file}"
           data-service-id="${service.serviceId}">
        <span>${service.label}</span>
        <div class="service-actions">
          <div class="action-button copy" data-action="copy" data-value="${service.label}" title="Copy service name"></div>
        </div>
      </div>
    `).join('');
  }

  async refresh() {
    this.services = this.context.workspaceState.get('services') || [];
    this.filteredServices = this.services;
    this.updateContent();
  }

  searchServices(searchTerm) {
    this.filteredServices = searchTerm
      ? this.services.filter(service =>
          service.label.toLowerCase().includes(searchTerm.toLowerCase()))
      : this.services;

    this.updateContent();
  }
}

module.exports = {
  ServiceWebviewProvider
};
