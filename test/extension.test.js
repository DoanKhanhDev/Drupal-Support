const assert = require('assert');
const vscode = require('vscode');
const sinon = require('sinon');
const proxyquire = require('proxyquire').noCallThru();

suite('Drupal Support Extension Test Suite', () => {
  vscode.window.showInformationMessage('Starting Drupal Support extension tests.');

  let sandbox;

  setup(() => {
    sandbox = sinon.createSandbox();
  });

  teardown(() => {
    sandbox.restore();
  });

  test('Extension should activate and initialize correctly', async () => {
    // Mock workspace folders
    sandbox.stub(vscode.workspace, 'workspaceFolders').value([
      { uri: { fsPath: '/test/workspace' } }
    ]);

    // Create context with workspaceState
    const context = {
      workspaceState: {
        update: sandbox.stub().resolves()
      }
    };

    // Create stubs for the required modules
    const registerCommandsStub = sandbox.stub();
    const initRunningStub = sandbox.stub();
    const registerWorkSpaceStub = sandbox.stub();
    const registerCompletionStub = sandbox.stub();

    // Create extension with stubs
    const extensionWithStubs = proxyquire('../extension', {
      './src/commands/registerCommands': { registerCommands: registerCommandsStub },
      './src/services/initRunning': { initRunning: initRunningStub },
      './src/workspace/registerWorkSpace': { registerWorkSpace: registerWorkSpaceStub },
      './src/completion/registerCompletion': { registerCompletion: registerCompletionStub }
    });

    // Activate the extension
    await extensionWithStubs.activate(context);

    // Verify that init was called correctly
    assert.strictEqual(context.workspaceState.update.calledOnce, true);
    assert.strictEqual(context.workspaceState.update.firstCall.args[0], 'wsPath');
    assert.strictEqual(context.workspaceState.update.firstCall.args[1], '/test/workspace');

    // Verify that all required functions were called
    assert.strictEqual(registerCommandsStub.calledOnce, true);
    assert.strictEqual(registerCompletionStub.calledOnce, true);
    assert.strictEqual(initRunningStub.calledOnce, true);
    assert.strictEqual(registerWorkSpaceStub.calledOnce, true);
  });

  test('Extension should handle missing workspace folders', async () => {
    // Mock workspace folders to be null
    sandbox.stub(vscode.workspace, 'workspaceFolders').value(null);

    // Create context with workspaceState
    const context = {
      workspaceState: {
        update: sandbox.stub().resolves()
      }
    };

    // Create stubs for the required modules
    const registerCommandsStub = sandbox.stub();
    const initRunningStub = sandbox.stub();
    const registerWorkSpaceStub = sandbox.stub();
    const registerCompletionStub = sandbox.stub();

    // Create extension with stubs
    const extensionWithStubs = proxyquire('../extension', {
      './src/commands/registerCommands': { registerCommands: registerCommandsStub },
      './src/services/initRunning': { initRunning: initRunningStub },
      './src/workspace/registerWorkSpace': { registerWorkSpace: registerWorkSpaceStub },
      './src/completion/registerCompletion': { registerCompletion: registerCompletionStub }
    });

    // This should throw an error because workspaceFolders is null
    try {
      await extensionWithStubs.activate(context);
      assert.fail('Should have thrown an error');
    } catch (error) {
      // Expected error because workspaceFolders[0] would be undefined
      assert.ok(error instanceof TypeError);
    }

    // Verify that none of the functions were called
    assert.strictEqual(registerCommandsStub.called, false);
    assert.strictEqual(registerCompletionStub.called, false);
    assert.strictEqual(initRunningStub.called, false);
    assert.strictEqual(registerWorkSpaceStub.called, false);
  });
});
