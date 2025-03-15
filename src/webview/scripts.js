function getWebviewScripts() {
  return `
    const vscode = acquireVsCodeApi();

    document.querySelector('.search-box').addEventListener('input', (e) => {
      vscode.postMessage({
        command: 'search',
        searchTerm: e.target.value
      });
    });

    document.addEventListener('click', (e) => {
      // Check for copy button first
      const copyButton = e.target.closest('[data-action="copy"]');
      if (copyButton) {
        // Stop event propagation to prevent parent handlers from firing
        e.stopPropagation();

        const textToCopy = copyButton.dataset.value;
        navigator.clipboard.writeText(textToCopy)
          .then(() => {
            // Visual feedback
            copyButton.style.backgroundColor = 'var(--vscode-button-hoverBackground)';
            copyButton.style.opacity = '1';

            // Reset button style after animation
            setTimeout(() => {
              copyButton.style.backgroundColor = '';
              copyButton.style.opacity = '';
            }, 200);
          })
          .catch(err => {
            console.error('Failed to copy text: ', err);
          });

        return;
      }

      // Handle service item click (open file)
      const serviceItem = e.target.closest('.service-item');
      if (serviceItem) {
        vscode.postMessage({
          command: 'openFile',
          file: serviceItem.dataset.file,
          serviceId: serviceItem.dataset.serviceId
        });
      }

      // Handle section toggle
      const sectionTitle = e.target.closest('.section-title');
      if (sectionTitle) {
        const section = sectionTitle.closest('.section').classList.contains('core') ? 'core' : 'modules';
        vscode.postMessage({
          command: 'toggleSection',
          section: section
        });
      }
    });

    window.addEventListener('message', event => {
      const message = event.data;
      if (message.type === 'updateList') {
        document.getElementById('services-list').innerHTML = message.html;
      }
    });
  `;
}

module.exports = {
  getWebviewScripts
};
