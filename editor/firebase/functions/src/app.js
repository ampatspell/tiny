const normalizeConfig = require('./config');
const services = require('./services');

module.exports = class Application {

  constructor(admin, functions) {
    this.admin = admin;
    this.functions = functions;
    this.auth = admin.auth();
    this.firestore = admin.firestore();
    this.storage = admin.storage();
    this.bucket = this.storage.bucket();
    this.config = normalizeConfig(functions.config());
    this.services = services(this);
    this.exports = {
    };
  }

  get fieldValue() {
    let value = this._fieldValue;
    if(!value) {
      value = require('./util/field-value');
      this._fieldValue = value;
    }
    return value;
  }

  require(name) {
    return require(name)(this);
  }

  info(...args) {
    if(!this.config.logging.enabled) {
      return;
    }
    console.log(...args);
  }

  dir(arg) {
    return require('util').inspect(arg, { depth: 25 });
  }

}
