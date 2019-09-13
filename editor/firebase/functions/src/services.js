const { properties } = require('./util/lazy');

let services = [
  'firestore',
  'storage',
  'https',
  'user'
];

class Services {

  constructor(app) {
    this.app = app;
  }

}

properties(Services, services, name => require(`./services/${name}`), (factory, { app }) => factory(app));

module.exports = app => new Services(app);
