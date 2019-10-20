const path = require('path');
const fetch = require('../util/fetch');
const write = require('../util/write');
const Cache = require('./cache');
const { Project } = require('./project');
const ejs = require('../util/ejs');

class Runtime {

  constructor(config) {
    this.config = config;
    this.cache = new Cache(config.cache);
  }

  async _fetch() {
    let { config: { url, token } } = this;
    return await fetch(url, token);
  }

  async fetch() {
    let json = await this._fetch();
    await this.cache.save(json);
  }

  async project() {
    let json = await this.cache.retrieve();
    return new Project(json);
  }

  render(filename, props) {
    return ejs(filename, props);
  }

  async write(filename, content) {
    let { config: { target } } = this;
    await write(path.join(target, filename), content);
  }

}

module.exports = Runtime;
