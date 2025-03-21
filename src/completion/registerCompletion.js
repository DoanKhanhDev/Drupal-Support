const { serviceCompletion } = require('./serviceCompletion');

function registerCompletion(context) {
  serviceCompletion(context)
}

module.exports = {
  registerCompletion
}
