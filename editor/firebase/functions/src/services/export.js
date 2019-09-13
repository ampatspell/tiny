let { properties } = require('../util/lazy');

class ExportService {

  constructor(app) {
    this.app = app;
  }

}

properties(ExportService, [ ], name => require(`./export/${name}`));

module.exports = app => new ExportService(app);
