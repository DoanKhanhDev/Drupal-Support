const { serviceCompletion } = require('./serviceCompletion');
const { routingCompletion } = require('./routingCompletion');

function registerCompletion(context) {
  serviceCompletion(context)
  routingCompletion(context)
}

module.exports = {
  registerCompletion
}
