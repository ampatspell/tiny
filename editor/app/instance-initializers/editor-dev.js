import setGlobal from '../utils/set-global';

export default {
  name: 'editor:dev',
  after: 'editor:store',
  initialize: app => { // eslint-disable-line no-unused-vars
    window.setGlobal = setGlobal;

    let store = app.lookup('service:store');

    window.save = async (path, width, height) => {
      let sprite = store.doc(path).new({
        size: {
          width,
          height
        }
      });

      let frame = index => {
        let random = () => Math.round(Math.random());
        let arr = [];
        for(let i = 0; i < (width * height); i++) {
          arr.push(random());
        }
        let bytes = new Uint8Array(arr);
        return store.doc(`${path}/frames/${index}`).new({
          index,
          bytes
        });
      }

      let frames = [
        frame(0),
        frame(1)
      ];

      await Promise.all([
        sprite.save(),
        ...frames.map(frame => frame.save())
      ]);

      return { sprite, frames };
    }

  }
};
