module.exports = app => app.functions.https.onCall(async () => {

  let { name, version } = require('../../package.json');

  return {
    name,
    version
  };
});
