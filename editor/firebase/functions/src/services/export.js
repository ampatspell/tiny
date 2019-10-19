let { properties } = require('../util/lazy');
let { pick } = require('../util/object');
let assert = require('assert');

class ExportService {

  constructor(app) {
    this.app = app;
    this.mapping = this._createMapping();
  }

  _createMapping() {
    let make = (keys, fn) => data => {
      data = pick(data, keys);
      if(fn) {
        data = fn(data);
      }
      return data;
    };

    let base = [ 'identiifer', 'index' ];
    let child = [ ...base, 'parent' ];
    let node = [ ...child, 'position' ];
    let sprite = [ ...node, 'alignment', 'flip', 'sprite' ];
    return {
      'scene':                         make([ ...base, 'name', 'background', 'size' ]),
      'scene/layer/grid':              make([ ...child, 'grid' ]),
      'scene/layer/pixel':             make([ ...child ]),
      'scene/layer/node/fill':         make([ ...node, 'size', 'color' ]),
      'scene/layer/node/sprite/frame': make([ ...sprite, 'frame' ]),
      'scene/layer/node/sprite/loop':  make([ ...sprite, 'loop' ]),
      'sprite':                        make([ ...base, 'size' ]),
      'sprite/frame':                  make([ ...child, 'bytes' ], data => {
        if(data.bytes) {
          data.bytes = [ ...data.bytes ];
        }
        return data;
      }),
      'sprite/loop':                   make([ ...child, 'frames' ])
    };
  }

  async _exportProperties(snapshot) {
    let data = snapshot.data();
    if(!data) {
      return;
    }
    let { properties } = data;
    properties = properties || {};
    let parse = value => {
      try {
        return JSON.parse(value);
      } catch(_) {
        return value;
      }
    }
    return Object.keys(properties).reduce((hash, key) => {
      let value = properties[key];
      if(value === '') {
        return;
      }
      hash[key] = parse(value);
      return hash;
    }, {});
  }

  async _exportEntity(entity) {
    let data = entity.data();
    if(!data) {
      return;
    }

    let properties = await this._exportProperties(entity);

    let { type } = data;
    let mapping = this.mapping[type];
    assert(!!mapping, `unsupported entity '${type}'`);

    let { id } = entity;
    return Object.assign({ id, type }, mapping(data), { properties });
  }

  async _exportEntities(entities) {
    return await Promise.all(entities.docs.map(snapshot => this._exportEntity(snapshot)));
  }

  async exportProject(project) {
    let data = project.data();
    if(!data) {
      return;
    }

    let [ entities, properties ] = await Promise.all([
      this._exportEntities(await project.ref.collection('entities').get()),
      this._exportProperties(project)
    ]);

    return Object.assign(pick(data, [ 'title' ]), { id: project.id, properties, entities });
  }

  async byToken(token) {
    let snapshot = await this.app.firestore.collection('projects').where('token', '==', token).get();

    if(snapshot.size === 0) {
      throw new Error(`Word not found for token '${token}'`);
    }

    if(snapshot.size > 1) {
      throw new Error(`Multiple worlds fortoken '${token}' found`);
    }

    return await this.exportProject(snapshot.docs[0]);
  }

}

properties(ExportService, [], name => require(`./export/${name}`));

module.exports = app => new ExportService(app);
