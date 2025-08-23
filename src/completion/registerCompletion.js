const serviceCompletion = require('./serviceCompletion');
const routingCompletion = require('./routingCompletion');

function registerCompletion(context) {
  new serviceCompletion(context).register();
  new routingCompletion(context).register();
}

module.exports = {
  registerCompletion
}
