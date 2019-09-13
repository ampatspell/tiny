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
        title: 'The Bug'
      },
      'projects/bug/sprites/one': {
        identifier: 'weirdo',
        size: {
          width: 16,
          height: 16
        }
      },
      'projects/bug/sprites/one/frames/1': {
        index: 1,
        bytes: new Uint8Array([ 1, 2, 3 ])
      },
      'projects/bug/sprites/one/frames/2': {
        identifier: '2',
        index: 2,
        bytes: new Uint8Array([ 2, 3, 4 ])
      },
      'projects/bug/sprites/one/loops/wink': {
        identifier: 'wink',
        frames: [ '1', '2' ]
      },
      'projects/bug/worlds/earth': {
        token: 'the-token',
        name: 'Earth'
      },
      'projects/bug/worlds/earth/scenes/intro': {
        background: 'black',
        identifier: 'intro',
        name: 'Earth',
        size: {
          width: 128,
          height: 64
        }
      },
      'projects/bug/worlds/earth/scenes/intro/layers/background': {
        identifier: 'background',
        type: 'grid',
        index: 0,
        grid: {
          width: 8,
          height: 8
        }
      },
      'projects/bug/worlds/earth/scenes/intro/layers/background/nodes/1': {
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
        }
      },
      'projects/bug/worlds/earth/scenes/intro/layers/char': {
        identifier: 'char',
        type: 'pixel',
        index: 1
      },
      'projects/bug/worlds/earth/scenes/intro/layers/char/nodes/1': {
        index: 0,
        type: 'sprite/loop',
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
      'projects/bug/worlds/earth/scenes/intro/layers/char/nodes/2': {
        index: 1,
        type: 'fill',
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

  it('hello', async () => {
    await this.insert();
    let json = await this.export.usingToken('the-token');
    assert.deepEqual(json, {
      project: { id: 'bug', title: 'The Bug' },
      world: {
        id: 'earth',
        name: 'Earth',
        sprites: [
          {
            id: 'one',
            identifier: 'weirdo',
            size: { height: 16, width: 16 },
            frames: [
              { id: '1', bytes: [ 1, 2, 3 ], index: 1 },
              { id: '2', bytes: [ 2, 3, 4 ], identifier: '2', index: 2 }
            ],
            loops: [
              { id: 'wink', identifier: 'wink', frames: [ '1', '2' ] }
            ]
          }
        ],
        scenes: [
          {
            id: 'intro',
            identifier: 'intro',
            background: 'black',
            name: 'Earth',
            size: { height: 64, width: 128 },
            layers: [
              {
                id: 'background',
                identifier: 'background',
                type: 'grid',
                index: 0,
                grid: { height: 8, width: 8 },
                nodes: [
                  {
                    id: '1',
                    index: 0,
                    type: 'sprite/frame',
                    sprite: 'weirdo',
                    frame: '2',
                    position: { x: 104, y: 40 },
                    alignment: { vertical: 'top', horizontal: 'left' },
                    flip: { horizontal: false, vertical: false }
                  }
                ]
              },
              {
                id: 'char',
                identifier: 'char',
                type: 'pixel',
                index: 1,
                nodes: [
                  {
                    id: '1',
                    index: 0,
                    type: 'sprite/loop',
                    sprite: 'weirdo',
                    position: { y: 40, x: 104 },
                    alignment: { vertical: 'top', horizontal: 'left' },
                    flip: { horizontal: false, vertical: false },
                    loop: 'wink',
                  },
                  {
                    id: '2',
                    index: 1,
                    type: 'fill',
                    position: { y: 40, x: 104 },
                    color: 'white'
                  }
                ]
              }
            ]
          }
        ]
      }
    });
  });

});
