import EmberObject, { computed } from '@ember/object';
import { readOnly, or } from '@ember/object/computed';
import { observed, resolveObservers, models } from 'ember-cli-zuglet/lifecycle';

const path = fn => observed().owner('path').content(fn);

const size = key => computed(`size.${key}`, function() {
  let size = this.size;
  if(!size) {
    return;
  }
  let value = size[key];
  if(!value) {
    return;
  }
  let indexes = [];
  for(let i = 0; i < value; i++) {
    indexes.push(i);
  }
  return indexes;
}).readOnly();

export default EmberObject.extend({

  path: null,

  doc: path(({ store, path }) => store.doc(path).existing()),
  framesQuery: path(({ store, path }) => store.collection(`${path}/frames`).query()),

  frames: models('framesQuery.content').named('sprite/frame').mapping((doc, sprite) => ({ doc, sprite })),

  isLoading: or('doc.isLoading', 'framesQuery.isLoading'),

  size: readOnly('doc.data.size.serialized'),

  _columns: size('height'),
  _rows:    size('width'),

  async load() {
    setGlobal({ sprite: this });
    let { doc, framesQuery } = this;
    await resolveObservers(doc, framesQuery);
  }

});
