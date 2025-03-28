const assert = require('assert');
const vscode = require('vscode');
const sinon = require('sinon');

suite('Drupal Support Extension Test Suite', () => {
  vscode.window.showInformationMessage('Starting Drupal Support extension tests.');

  let sandbox;

  setup(() => {
    sandbox = sinon.createSandbox();
  });

  teardown(() => {
    sandbox.restore();
  });

  test('Extension should activate only in Drupal workspace', async () => {
    // Mock findFiles to simulate a Drupal workspace
    const findFilesStub = sandbox.stub(vscode.workspace, 'findFiles');

    // Test when Drupal.php is found
    findFilesStub.resolves([{ fsPath: '/path/to/core/lib/Drupal.php' }]);
    const context = { workspaceState: { update: sandbox.stub() } };

    // Mock workspace folders
    sandbox.stub(vscode.workspace, 'workspaceFolders').value([
      { uri: { fsPath: '/test/workspace' } }
    ]);

    // Mock the command registration and other functions
    const registerCommandsStub = sandbox.stub();
    const initRunningStub = sandbox.stub();
    const registerWorkSpaceStub = sandbox.stub();

    // Replace the require calls with our stubs
    const proxyquire = require('proxyquire').noCallThru();
    const extensionWithStubs = proxyquire('../extension', {
      './src/commands/registerCommands': { registerCommands: registerCommandsStub },
      './src/services/initRunning': { initRunning: initRunningStub },
      './src/workspace/registerWorkSpace': { registerWorkSpace: registerWorkSpaceStub }
    });

    await extensionWithStubs.activate(context);

    assert.strictEqual(context.workspaceState.update.calledOnce, true);
    assert.strictEqual(registerCommandsStub.calledOnce, true);
    assert.strictEqual(initRunningStub.calledOnce, true);
    assert.strictEqual(registerWorkSpaceStub.calledOnce, true);

    // Test when Drupal.php is not found
    findFilesStub.resolves([]);
    await extensionWithStubs.activate(context);

    // The functions should not be called again
    assert.strictEqual(context.workspaceState.update.calledOnce, true);
    assert.strictEqual(registerCommandsStub.calledOnce, true);
    assert.strictEqual(initRunningStub.calledOnce, true);
    assert.strictEqual(registerWorkSpaceStub.calledOnce, true);
  });
});
