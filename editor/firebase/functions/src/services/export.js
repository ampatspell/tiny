let { properties } = require('../util/lazy');
let { pick } = require('../util/object');

class ExportService {

  constructor(app) {
    this.app = app;
  }

  async _exportSpriteFrame(frame) {
    let data = frame.data();
    if(!data) {
      return;
    }

    let bytes = data.bytes || null;
    if(bytes) {
      bytes = [ ...bytes ];
    }

    return Object.assign(pick(data, [ 'identifier' ]), { _id: frame.id, bytes });
  }

  async _exportSpriteLoop(loop) {
    let data = loop.data();
    if(!data) {
      return;
    }
    return Object.assign(pick(data, [ 'identifier', 'frames' ]), { _id: loop.id });
  }

  async _exportSpriteFrames(frames) {
    return await Promise.all(frames.docs.map(snapshot => this._exportSpriteFrame(snapshot)));
  }

  async _exportSpriteLoops(loops) {
    return await Promise.all(loops.docs.map(snapshot => this._exportSpriteLoop(snapshot)));
  }

  async _exportSprite(sprite) {
    let data = sprite.data();
    if(!data) {
      return;
    }

    let [ frames, loops ] = await Promise.all([
      this._exportSpriteFrames(await sprite.ref.collection('frames').orderBy('index', 'asc').get()),
      this._exportSpriteLoops(await sprite.ref.collection('loops').get()),
    ]);

    loops.map(loop => {
      loop.frames = loop.frames.map(id => {
        let frame = frames.find(frame => frame._id === id);
        return frames.indexOf(frame);
      });
    });

    return Object.assign(pick(data, [ 'identifier', 'size' ]), { _id: sprite.id, frames, loops });
  }

  async _exportSprites(sprites) {
    return await Promise.all(sprites.docs.map(snapshot => this._exportSprite(snapshot)));
  }

  async _exportSceneLayerNode(node) {
    let data = node.data();
    if(!data) {
      return;
    }

    return Object.assign(pick(data, [ 'type', 'sprite', 'frame', 'position', 'alignment', 'flip', 'loop', 'color' ]), { _id: node.id });
  }

  async _exportSceneLayerNodes(nodes) {
    return await Promise.all(nodes.docs.map(snapshot => this._exportSceneLayerNode(snapshot)));
  }

  async _exportSceneLayer(layer) {
    let data = layer.data();
    if(!data) {
      return;
    }

    let nodes = await this._exportSceneLayerNodes(await layer.ref.collection('nodes').orderBy('index', 'asc').get());

    return Object.assign(pick(data, [ 'identifier', 'type', 'grid' ]), { _id: layer.id, nodes });
  }

  async _exportSceneLayers(layers) {
    return await Promise.all(layers.docs.map(snapshot => this._exportSceneLayer(snapshot)));
  }

  async _exportScene(scene) {
    let data = scene.data();
    if(!data) {
      return;
    }

    let layers = await this._exportSceneLayers(await scene.ref.collection('layers').orderBy('index', 'asc').get());

    return Object.assign(pick(data, [ 'identifier', 'background', 'name', 'size' ]), { _id: scene.id, layers });
  }

  async _exportScenes(scenes) {
    return await Promise.all(scenes.docs.map(snapshot => this._exportScene(snapshot)));
  }

  async _exportWorld(world) {
    let data = world.data();
    if(!data) {
      return;
    }

    let [ scenes ] = await Promise.all([
      this._exportScenes(await world.ref.collection('scenes').orderBy('index', 'asc').get())
    ]);

    return Object.assign(pick(data, [ 'name' ]), { _id: world.id, scenes });
  }

  async _exportProject(project) {
    let data = project.data();
    if(!data) {
      return;
    }

    return Object.assign(pick(data, [ 'title' ]), { _id: project.id });
  }

  async exportWorld(worldSnapshot) {
    let [ project, sprites, world ] = await Promise.all([
      this._exportProject(await worldSnapshot.ref.parent.parent.get()),
      this._exportSprites(await worldSnapshot.ref.parent.parent.collection('sprites').get()),
      this._exportWorld(worldSnapshot)
    ]);

    return {
      project,
      sprites,
      world
    };
  }

  async byToken(token) {
    let snapshot = await this.app.firestore.collectionGroup('worlds').where('token', '==', token).get();

    if(snapshot.size === 0) {
      throw new Error(`Word not found for token '${token}'`);
    }

    if(snapshot.size > 1) {
      throw new Error(`Multiple worlds fortoken '${token}' found`);
    }

    return await this.exportWorld(snapshot.docs[0]);
  }

}

properties(ExportService, [], name => require(`./export/${name}`));

module.exports = app => new ExportService(app);
