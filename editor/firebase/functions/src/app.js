const normalizeConfig = require('./config');
const services = require('./services');

module.exports = class Application {

  constructor(admin, functions) {
    this.admin = admin;
    this.functions = functions.region('europe-west2');
    this.auth = admin.auth();
    this.firestore = admin.firestore();
    this.storage = admin.storage();
    this.bucket = this.storage.bucket();
    this.config = normalizeConfig(functions.config());
    this.services = services(this);
    this.exports = {
      version: this.require('./actions/version'),
      export: {
        world: this.require('./actions/export/world')
      },
      auth: {
        onCreate: this.require('./triggers/auth/on-create')
      },
      projects: {
        onDelete: this.require('./triggers/projects/on-delete'),
        sprites: {
          onDelete: this.require('./triggers/projects/sprites/on-delete')
        },
        worlds: {
          onDelete: this.require('./triggers/projects/worlds/on-delete'),
          scenes: {
            onDelete: this.require('./triggers/projects/worlds/scenes/on-delete'),
            layers: {
              onDelete: this.require('./triggers/projects/worlds/scenes/layers/on-delete')
            }
          }
        }
      }
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
