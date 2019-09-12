module.exports = (sender, environment) => {

  sender.environment = environment;

  const setupAdmin = require('./setup-admin');
  const setupApp = require('./setup-app');
  const setupTest = require('./setup-test');
  const setupHelpers = require('./setup-helpers');

  let destroyables = [
    setupTest(sender),
    setupApp(sender),
    setupAdmin(sender),
    setupHelpers(sender)
  ];

  require('./mock')(sender);

  return () => Promise.all(destroyables.map(destroy => destroy()));
}
