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

      let index = 0;

      const migrateSprites = sprites => Promise.all(sprites.map((sprite, idx) => migrateSprite(sprite, index + idx)));

      let sprites = await migrateSprites(await project.ref.collection('sprites').load());
      index += sprites.length;

        // Promise.all(scenes.map(async scene => {
        //   let layers = await scene.ref.collection('layers').load();
        //   await Promise.all(layers.map(async layer => {
        //     let nodes = await layer.ref.collection('nodes').load();
        //     nodes.map(async node => {
        //       console.log(node.path);
        //     });
        //   }));
        // }));
    }
  }
};
