const fs = require('fs-extra');
const path = require('path');

/**
 * Creates a mock Drupal workspace for testing
 */
async function createTestWorkspace() {
  const testWorkspacePath = path.join(__dirname, 'test-workspace');
  const drupalCorePath = path.join(testWorkspacePath, 'core', 'lib');

  // Create the directory structure
  await fs.ensureDir(drupalCorePath);

  // Create a mock Drupal.php file
  await fs.writeFile(
    path.join(drupalCorePath, 'Drupal.php'),
    '<?php\n/**\n * Mock Drupal.php file for testing\n */\nclass Drupal {}\n'
  );

  return testWorkspacePath;
}

module.exports = { createTestWorkspace };
