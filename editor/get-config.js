const assert = require('assert');
const fs = require('fs');
const path = require('path');

const getConfig = (opts={}) => {
  let alias = process.env.FIREBASE || opts.alias;
  assert(!!alias, `FIREBASE=<alias> is required`);

  let mapping = JSON.parse(fs.readFileSync(path.join(__dirname, 'firebase', '.firebaserc'), 'utf-8'));
  let id = mapping.projects[alias];
  assert(id, `Firebase project id for alias '${alias}' wasn't found in .firebaserc`);

  let config = require('./config')[id];
  assert(config, `Configuration for project id '${id}' was not found in config.js`);
  assert(!config.firebase || config.firebase.projectId === id, `Firebase projectId '${config.firebase.projectId}' in config.js does not match project id '${id}'`);

  if(opts.log !== false) {
    console.log();
    console.log('Firebase:', id, `(${alias})`);
  }

  let serviceAccountKey = require.resolve(`./${alias}-service-account-key.json`);

  return Object.assign({ }, config, { alias, id, serviceAccountKey });
}

let resolved;

const getConfigCached = opts => {
  if(!resolved) {
    resolved = getConfig(opts);
  }
  return resolved;
}

module.exports = getConfigCached;

let arg = process.argv.slice(-1)[0];
if(arg === '--run') {
  let config = getConfig({ alias: 'development' });
  console.log(JSON.stringify(config, null, 2));
}
