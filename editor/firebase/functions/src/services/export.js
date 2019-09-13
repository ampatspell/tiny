let { properties } = require('../util/lazy');
let { pick } = require('../util/object');

class ExportService {

  constructor(app) {
    this.app = app;
  }

  async _exportProject(project) {
    let data = project.data();
    if(!data) {
      return;
    }
    return Object.assign({ id: project.id }, pick(data, [ 'title' ]));
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

    return Object.assign({ id: frame.id, bytes }, pick(data, [ 'identifier', 'index' ]));
  }

  async _exportSpriteLoop(loop) {
    let data = loop.data();
    if(!data) {
      return;
    }
    return Object.assign({ id: loop.id }, pick(data, [ 'identifier', 'frames' ]));
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

    return Object.assign(pick(data, [ 'identifier', 'size' ]), { id: sprite.id, frames, loops });
  }

  async _exportSprites(sprites) {
    return await Promise.all(sprites.docs.map(snapshot => this._exportSprite(snapshot)));
  }

  async _exportSceneLayerNode(node) {
    let data = node.data();
    if(!data) {
      return;
    }

    return Object.assign(pick(data, [ 'index', 'type', 'sprite', 'frame', 'position', 'alignment', 'flip', 'loop', 'color' ]), { id: node.id });
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

    return Object.assign(pick(data, [ 'identifier', 'type', 'index', 'grid' ]), { id: layer.id, nodes });
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

    return Object.assign(pick(data, [ 'identifier', 'background', 'name', 'size' ]), { id: scene.id, layers });
  }

  async _exportScenes(scenes) {
    return await Promise.all(scenes.docs.map(snapshot => this._exportScene(snapshot)));
  }

  async _exportWorld(world) {
    let data = world.data();
    if(!data) {
      return;
    }

    let [ sprites, scenes ] = await Promise.all([
      this._exportSprites(await world.ref.parent.parent.collection('sprites').get()),
      this._exportScenes(await world.ref.collection('scenes').get())
    ]);

    return Object.assign(pick(data, [ 'name' ]), { id: world.id, sprites, scenes });
  }

  async exportWorld(worldSnapshot) {
    let [ project, world ] = await Promise.all([
      this._exportProject(await worldSnapshot.ref.parent.parent.get()),
      this._exportWorld(worldSnapshot)
    ]);

    return {
      project,
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
