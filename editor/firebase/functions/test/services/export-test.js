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
        name: 'Earth',
        properties: {
          className: 'TheWorld',
          speed: '5',
          ok: true,
          names: '[ "one", "two" ]'
        }
      },
      'projects/bug/worlds/earth/scenes/intro': {
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
      'projects/bug/worlds/earth/scenes/intro/layers/background': {
        identifier: 'background',
        type: 'grid',
        index: 0,
        grid: {
          width: 8,
          height: 8
        },
        properties: {
          className: 'TheBackground'
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
        },
        properties: {
          className: 'TheNode'
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
    let json = await this.export.byToken('the-token');
    assert.deepEqual(json, {
      project: {
        _id: 'bug',
        title: 'The Bug',
      },
      sprites: [
        {
          _id: 'one',
          identifier: 'weirdo',
          size: { height: 16, width: 16 },
          frames: [
            { _id: '1', bytes: [ 1, 2, 3 ] },
            { _id: '2', bytes: [ 2, 3, 4 ], identifier: '2' }
          ],
          loops: [
            { _id: 'wink', identifier: 'wink', frames: [ 0, 1 ] }
          ]
        }
      ],
      world: {
        _id: 'earth',
        name: 'Earth',
        properties: {
          className: 'TheWorld',
          speed: 5,
          ok: true,
          names: [ 'one', 'two' ]
        },
        scenes: [
          {
            _id: 'intro',
            identifier: 'intro',
            background: 'black',
            name: 'Earth',
            properties: {
              className: 'TheScene'
            },
            size: { height: 64, width: 128 },
            layers: [
              {
                _id: 'background',
                identifier: 'background',
                type: 'grid',
                grid: { height: 8, width: 8 },
                properties: {
                  className: 'TheBackground'
                },
                nodes: [
                  {
                    _id: '1',
                    type: 'sprite/frame',
                    sprite: 'weirdo',
                    frame: '2',
                    position: { x: 104, y: 40 },
                    alignment: { vertical: 'top', horizontal: 'left' },
                    flip: { horizontal: false, vertical: false },
                    properties: {
                      className: 'TheNode'
                    },
                  }
                ]
              },
              {
                _id: 'char',
                identifier: 'char',
                type: 'pixel',
                properties: {},
                nodes: [
                  {
                    _id: '1',
                    type: 'sprite/loop',
                    sprite: 'weirdo',
                    position: { y: 40, x: 104 },
                    alignment: { vertical: 'top', horizontal: 'left' },
                    flip: { horizontal: false, vertical: false },
                    loop: 'wink',
                    properties: {},
                  },
                  {
                    _id: '2',
                    type: 'fill',
                    position: { y: 40, x: 104 },
                    color: 'white',
                    properties: {},
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
