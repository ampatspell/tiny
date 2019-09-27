import setGlobal from '../utils/set-global';
import { all } from 'rsvp';

export default {
  name: 'editor:dev',
  after: 'editor:store',
  initialize: app => { // eslint-disable-line no-unused-vars
    window.setGlobal = setGlobal;
    window.migrate = async () => {
      let store = app.lookup('service:store');
      let from = store.collection('projects/lSYrAHenmCT2nStV3ydf/worlds/sklqO80ntCp5ccShuSpe/scenes');
      let to = store.collection('projects/lSYrAHenmCT2nStV3ydf/scenes');

      let scenes = await from.load();
      await all(scenes.map(async scene => {
        let _scene = to.doc(scene.id).new(scene.data.serialized);
        await _scene.save();
        let layers = await scene.ref.collection('layers').load();
        await all(layers.map(async layer => {
          let _layer = _scene.ref.collection('layers').doc(layer.id).new(layer.data.serialized);
          await _layer.save();
          let nodes = await layer.ref.collection('nodes').load();
          await all(nodes.map(async node => {
            let _node = _layer.ref.collection('nodes').doc(node.id).new(node.data.serialized);
            await _node.save();
          }));
        }));
      }));

    }
  }
};
