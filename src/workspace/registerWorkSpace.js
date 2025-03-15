const { onSaveFile } = require('./onSaveFile');
const { onDeleteFile } = require('./onDeleteFile');

function registerWorkSpace(context) {
  onSaveFile(context);
  onDeleteFile(context);
}

module.exports = {
  registerWorkSpace,
};
