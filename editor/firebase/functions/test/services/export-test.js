const setup = require('../helpers/setup');
const assert = require('assert');

describe('services / export', () => {
  setup(this);

  beforeEach(() => {
    require('events').EventEmitter.defaultMaxListeners = 15;

    this.export = this.app.services.export;
    this.doc = path => this.admin.firestore.doc(path);
    this.documents = {
      'projects/bug': {
        title: 'The Bug',
        token: 'the-token',
        properties: {
          className: 'TheWorld',
          speed: '5',
          ok: true,
          names: '[ "one", "two" ]'
        }
      },
      'projects/bug/entities/one': {
        type: 'sprite',
        identifier: 'weirdo',
        size: {
          width: 16,
          height: 16
        }
      },
      'projects/bug/entities/one-1': {
        type: 'sprite/frame',
        parent: 'one',
        index: 1,
        bytes: new Uint8Array([ 1, 2, 3 ])
      },
      'projects/bug/entities/one-2': {
        type: 'sprite/frame',
        parent: 'one',
        identifier: '2',
        index: 2,
        bytes: new Uint8Array([ 2, 3, 4 ])
      },
      'projects/bug/entities/one-wink': {
        type: 'sprite/loop',
        parent: 'one',
        identifier: 'wink',
        frames: [ '1', '2' ]
      },
      'projects/bug/entities/intro': {
        type: 'scene',
        background: 'black',
        identifier: 'intro',
        name: 'Earth',
        index: 0,
        size: {
          width: 128,
          height: 64
        },
        properties: {
          className: 'TheScene'
        }
      },
      'projects/bug/entities/intro-background': {
        type: 'scene/layer/grid',
        parent: 'intro',
        identifier: 'background',
        index: 0,
        grid: {
          width: 8,
          height: 8
        },
        properties: {
          className: 'TheBackground'
        }
      },
      'projects/bug/entities/intro-background-1': {
        type: 'scene/layer/node/sprite/frame',
        parent: 'intro-background',
        index: 0,
        type: 'sprite/frame',
        sprite: "weirdo",
        frame: "2",
        position: {
          x: 104,
          y: 40
        },
        alignment: {
          horizontal: 'left',
          vertical: 'top'
        },
        flip: {
          horizontal: false,
          vertical: false
        },
        properties: {
          className: 'TheNode'
        }
      },
      'projects/bug/entities/intro-char': {
        type: 'scene/layer/pixel',
        parent: 'intro',
        identifier: 'char',
        index: 1
      },
      'projects/bug/entities/intro-char-1': {
        type: 'scene/layer/node/sprite/loop',
        parent: 'intro-char',
        index: 0,
        sprite: "weirdo",
        loop: 'wink',
        position: {
          x: 104,
          y: 40
        },
        alignment: {
          horizontal: 'left',
          vertical: 'top'
        },
        flip: {
          horizontal: false,
          vertical: false
        }
      },
      'projects/bug/entities/intro-char-2': {
        type: 'scene/layer/node/fill',
        parent: 'intro-char',
        index: 1,
        color: 'white',
        identifier: 'box',
        position: {
          x: 104,
          y: 40
        },
        size: {
          width: 8,
          height: 8
        }
      }
    }
    this.insert = async () => {
      let batch = this.admin.firestore.batch();
      let docs = this.documents;
      Object.keys(docs).forEach(path => batch.set(this.doc(path), docs[path]));
      await batch.commit();
    }
  });

  it('exports', async () => {
    await this.insert();
    let json = await this.export.byToken('the-token');
    assert.deepEqual(json, {
      title: 'The Bug',
      id: 'bug',
      properties: {
        names: [ 'one', 'two' ],
        ok: true,
        className: 'TheWorld',
        speed: 5
      },
      entities: [
        {
          id: 'intro',
          type: 'scene',
          index: 0,
          name: 'Earth',
          background: 'black',
          size: { height: 64, width: 128 },
          properties: { className: 'TheScene' }
        },
        {
          id: 'intro-background',
          parent: 'intro',
          type: 'scene/layer/grid',
          index: 0,
          grid: { height: 8, width: 8 },
          properties: { className: 'TheBackground' }
        },
        {
          id: 'intro-background-1',
          parent: 'intro-background',
          type: 'sprite/frame',
          index: 0,
          properties: { className: 'TheNode' }
        },
        {
          id: 'intro-char',
          parent: 'intro',
          type: 'scene/layer/pixel',
          index: 1,
          properties: {}
        },
        {
          id: 'intro-char-1',
          parent: 'intro-char',
          type: 'scene/layer/node/sprite/loop',
          index: 0,
          position: { y: 40, x: 104 },
          alignment: { vertical: 'top', horizontal: 'left' },
          flip: { vertical: false, horizontal: false },
          sprite: 'weirdo',
          loop: 'wink',
          properties: {}
        },
        {
          id: 'intro-char-2',
          parent: 'intro-char',
          type: 'scene/layer/node/fill',
          index: 1,
          position: { y: 40, x: 104 },
          size: { height: 8, width: 8 },
          color: 'white',
          properties: {}
        },
        {
          id: 'one',
          type: 'sprite',
          size: { width: 16, height: 16 },
          properties: {}
        },
        {
          id: 'one-1',
          parent: 'one',
          type: 'sprite/frame',
          index: 1,
          bytes: [ 1, 2, 3 ],
          properties: {}
        },
        {
          id: 'one-2',
          parent: 'one',
          type: 'sprite/frame',
          index: 2,
          bytes: [ 2, 3, 4 ],
          properties: {}
        },
        {
          id: 'one-wink',
          parent: 'one',
          type: 'sprite/loop',
          frames: [ '1', '2' ],
          properties: {}
        }
      ]
    });
  });

});
