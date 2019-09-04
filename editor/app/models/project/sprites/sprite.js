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

  sprites: null,
  doc: null,
  path: readOnly('doc.path'),

  framesQuery: path(({ store, path }) => store.collection(`${path}/frames`).orderBy('index').query()),

  frames: models('framesQuery.content').named('project/sprites/sprite/frame').mapping((doc, sprite) => ({ doc, sprite })),

  isLoading: or('doc.isLoading', 'framesQuery.isLoading'),

  size: readOnly('doc.data.size.serialized'),

  _columns: size('height'),
  _rows:    size('width'),

  async load() {
    setGlobal({ sprite: this });
    let { framesQuery } = this;
    await resolveObservers(framesQuery);
  }

});
