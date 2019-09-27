import EmberObject, { computed } from '@ember/object';
import { readOnly } from '@ember/object/computed';
import { observed, models, resolveObservers } from 'ember-cli-zuglet/lifecycle';
import { all } from 'rsvp';

export default EmberObject.extend({

  typeName: 'Loops',

  project: readOnly('sprite.project'),

  sprite: null,

  ref: computed('sprite.ref', function() {
    let { sprite: { ref } } = this;
    return ref.collection('loops');
  }).readOnly(),

  query: observed().owner('ref').content(({ ref }) => ref.query()),
  models: models('query.content').named('project/sprites/sprite/loops/loop').mapping((doc, loops) => ({ loops, doc })),

  ordered: computed('models.@each.identifier', function() {
    return this.models.sortBy('identifier');
  }).readOnly(),

  async load({ type }) {
    await resolveObservers(this.query);
    await all(this.models.map(model => model.load({ type })));
  },

  async create() {
    let frames = this.sprite.frames.ordered.map(frame => frame.id);

    let doc = this.ref.doc().new({
      identifier: 'new-loop',
      frames
    });

    await doc.save();
    return this.models.findBy('id', doc.id);
  },

  //

  async onFrameDeleted(frame) {
    await all(this.ordered.map(loop => loop.onFrameDeleted(frame)));
  }

});
