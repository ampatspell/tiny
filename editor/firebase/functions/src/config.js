// const assert = require('assert');

// const validate = (ok, message) => assert(ok, `Firebase config: ${message}`);

const normalizeBoolean = (value, defaultValue) => {
  if(value === 'true') {
    return true;
  }
  if(value === 'false') {
    return false;
  }
  return defaultValue;
}

// const normalizeArray = value => {
//   return value.split(',').map(item => item.trim());
// }

const normalizeLogging = (root={}) => {
  let { enabled } = root;
  enabled = normalizeBoolean(enabled, true);
  return { enabled };
}

module.exports = root => {
  let { logging, email } = root;
  return {
    logging: normalizeLogging(logging)
  };
}
