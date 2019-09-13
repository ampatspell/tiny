module.exports = function(alias) {

  let get = require('../../../../get-config');
  let config = get({ alias, log: false });

  alias = config.alias;

  return {
    get config() {
      return Object.assign({}, config.firebase);
    },
    get serviceAccountKey() {
      return config.serviceAccountKey;
    }
  };
}
