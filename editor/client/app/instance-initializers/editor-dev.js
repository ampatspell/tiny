import setGlobal from '../utils/set-global';

export default {
  name: 'editor:dev',
  after: 'editor:store',
  initialize: app => { // eslint-disable-line no-unused-vars
    window.setGlobal = setGlobal;
    window.migrate = async id => {
      let store = app.lookup('service:store');

      let project = await store.doc(`projects/${id}`).load();
      if(!project.exists) {
        console.log('project not found')
        return;
      }

      let mapping = {};
      let index = 0;

      let entities = project.ref.collection('entities');

      await Promise.all((await entities.load()).map(entity => entity.delete()));

      let save = async data => {
        let doc = entities.doc().new(data);
        await doc.save();
        return doc.id;
      }

      const migrateSpriteFrame = async (parent, frame) => {
        let data = frame.data.serialized;
        data.type = 'sprite/frame';
        data.parent = parent;
        let id = await save(data);
        mapping[frame.path] = id;
      }

      const migrateSpriteLoop = async (parent, sprite, loop) => {
        let data = loop.data.serialized;
        data.type = 'sprite/loop';
        data.parent = parent;
        data.frames = data.frames.map(id => mapping[`${sprite.ref.path}/frames/${id}`]);
        let id = await save(data);
        mapping[loop.path] = id;
      }

      const migrateSpriteFrames = (parent, frames) => Promise.all(frames.map(frame => migrateSpriteFrame(parent, frame)));
      const migrateSpriteLoops = (parent, sprite, loops) => Promise.all(loops.map(loop => migrateSpriteLoop(parent, sprite, loop)));

      const migrateSprite = async (sprite, index) => {
        let data = sprite.data.serialized;
        data.type = 'sprite';
        data.parent = null;
        data.index = index;
        delete data.thumbnail;

        let id = await save(data);
        mapping[sprite.path] = id;

        await migrateSpriteFrames(id, await sprite.ref.collection('frames').load());
        await migrateSpriteLoops(id, sprite, await sprite.ref.collection('loops').load());
      }

      const migrateSprites = async sprites => {
        await Promise.all(sprites.map((sprite, idx) => migrateSprite(sprite, index + idx)));
        index += sprites.length;
      }

      //

      const migrateLayerNode = async (parent, node) => {
        let data = node.data.serialized;
        data.type = `scene/layer/node/${data.type}`;
        data.parent = parent;

        let id = await save(data);
        mapping[node.path] = id;
      }

      const migrateLayerNodes = (parent, nodes) => Promise.all(nodes.map(node => migrateLayerNode(parent, node)));

      const migrateLayer = async (parent, scene, layer) => {
        let data = layer.data.serialized;
        data.type = `scene/layer/${data.type}`;
        data.parent = parent;
        data.expanded = true;

        let id = await save(data);
        mapping[scene.path] = id;

        await migrateLayerNodes(id, await layer.ref.collection('nodes').load());
      }

      const migrateLayers = async (parent, scene, layers) => Promise.all(layers.map(layer => migrateLayer(parent, scene, layer)));

      const migrateScene = async (scene, index) => {
        let data = scene.data.serialized;
        data.type = 'scene';
        data.parent = null;
        data.expanded = true;
        data.index = index;

        let id = await save(data);
        mapping[scene.path] = id;

        await migrateLayers(id, scene, await scene.ref.collection('layers').load());
      }

      const migrateScenes = scenes => Promise.all(scenes.map((scene, idx) => migrateScene(scene, index + idx)));

      //

      await migrateSprites(await project.ref.collection('sprites').load());
      await migrateScenes(await project.ref.collection('scenes').load());
    }
  }
};
