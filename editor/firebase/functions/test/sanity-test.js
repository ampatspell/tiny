const setup = require('./helpers/setup');
const assert = require('assert');
const { compact } = require('../src/util/object');

describe('sanity', () => {
  setup(this);

  it('has extensions', () => {
    assert.ok(this.test);
    assert.ok(this.admin);
    assert.ok(this.app);
    assert.ok(this.index);
  });

  it('creates a document', async () => {
    let doc = this.admin.firestore.doc(`messages/test`);

    await doc.set({ text: 'hey there' });

    let snapshot = await doc.get();
    assert.deepEqual(snapshot.data(), {
      text: 'hey there'
    });
  });

  it('has services and cached service', async () => {
    let services = this.app.services;
    assert.ok(services);

    let service = services.storage;
    assert.ok(service);
    assert.ok(service === services.storage);
  });

  it('has server timestamp', async () => {
    let ts = this.app.fieldValue.serverTimestamp();
    assert.ok(ts);
  });

  it('compacts object', async () => {
    let timestamp = this.app.fieldValue.serverTimestamp();
    assert.deepEqual(compact({
      ok: true,
      arr: [ 0, 1, 2, 3, null, undefined ],
      things: { foo: undefined, bar: null, baz: 0 },
      timestamp
    }), {
      ok: true,
      arr: [ 0, 1, 2, 3, null ],
      things: {
        bar: null,
        baz: 0
      },
      timestamp
    });
  });

  it('splits ref', () => {
    let doc = path => this.admin.firestore.doc(path);
    let coll = path => this.admin.firestore.collection(path);
    let test = (ref, expected) => assert.deepEqual(this.app.services.firestore.split(ref), expected);
    test(coll('foo'), [ 'foo' ]);
    test(doc('foo/bar'), [ 'foo', 'bar' ]);
    test(coll('foo/bar/baz'), [ 'foo', 'bar', 'baz' ]);
    test(doc('foo/bar/baz/zaz'), [ 'foo', 'bar', 'baz', 'zaz' ]);
  });

});
