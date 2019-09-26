import EmberObject, { computed } from '@ember/object';
import { readOnly } from '@ember/object/computed';
import { observed, models, resolveObservers } from 'ember-cli-zuglet/lifecycle';
import { assign } from '@ember/polyfills';
import { all } from 'rsvp';
import MoveMixin from '../../../../../-move';

export default EmberObject.extend(MoveMixin, {

  typeName: 'Nodes',

  project: readOnly('layer.project'),

  layer: null,

  chainHidden: readOnly('layer.chainHidden'),
  chainLocked: readOnly('layer.chainLocked'),

  ref: computed('layer.ref', function() {
    let { layer: { ref } } = this;
    return ref.collection('nodes');
  }).readOnly(),

  query: observed().owner('ref').content(({ ref }) => ref.query()),
  models: models('query.content').object('data.type').named(doc => {
    let type = doc.get('data.type');
    return `project/scenes/scene/layers/layer/nodes/node/type/${type}`;
  }).mapping((doc, nodes) => ({ nodes, doc })),

  ordered: computed('models.@each.index', function() {
    return this.models.sortBy('index');
  }).readOnly(),

  visible: computed('ordered.@each.hidden', function() {
    return this.ordered.filter(model => !model.hidden);
  }).readOnly(),

  reversed: computed('ordered', function() {
    return this.ordered.slice().reverse();
  }).readOnly(),

  async load({ type }) {
    await resolveObservers(this.query);
    await all(this.models.map(model => model.load({ type })));
  },

  async create(opts) {
    let last = this.ordered.lastObject;
    let index = 0;
    if(last) {
      index = last.index + 1;
    }

    opts = assign({}, opts, { index });
    let doc = this.ref.doc().new(opts);

    await doc.save();
    return this.project.select(this.models.findBy('id', doc.id));
  },

  async _createSprite(type, cb) {
    // let { sprite } = this;
    let sprite = null;

    let opts = cb(sprite);
    if(!opts) {
      return;
    }

    let identifier = null;
    if(sprite) {
      identifier = sprite.identifier;
    }

    await this.create({
      type: `sprite/${type}`,
      position: {
        x: 0,
        y: 0,
      },
      alignment: {
        vertical: 'top',
        horizontal: 'left'
      },
      flip: {
        horizontal: false,
        vertical: false
      },
      sprite: identifier,
      ...opts
    });
  },

  async createSpriteFrame()  {
    await this._createSprite('frame', sprite => {
      let frame;
      if(sprite) {
        frame = sprite.get('frames.firstObject.identifier');
      }
      frame = frame || null;
      return { frame };
    });
  },

  async createSpriteLoop() {
    await this._createSprite('loop', sprite => {
      let loop = null;
      if(sprite) {
        loop = sprite.get('loops.firstObject.identifier') || null;
      }
      return { loop };
    });
  },

  async createFill() {
    await this.create({
      type: 'fill',
      position: {
        x: 0,
        y: 0,
      },
      size: {
        width: 8,
        height: 8
      },
      color: 'black'
    });
  },

  onParentResized(id, diff) {
    this.models.forEach(model => model.onParentResized(id, diff));
  }

});
