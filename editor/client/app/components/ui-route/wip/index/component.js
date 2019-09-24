import Component from '@ember/component';
import EmberObject from '@ember/object';
import { computed } from '@ember/object';
import { A } from '@ember/array';
import { node } from 'ember-cli-konva';

export default Component.extend({
  classNameBindings: [ ':ui-route-wip-index' ],

  rects: computed(function() {
    let arr = A();
    let rect = attributes => EmberObject.create({ attributes });
    arr.pushObject(rect({ x: 10, y: 10, width: 50, height: 50, fill: 'rgba(255,0,0,0.1)'}));
    arr.pushObject(rect({ x: 70, y: 10, width: 50, height: 50, fill: 'rgba(255,0,0,0.1)'}));
    return arr;
  }).readOnly(),

  title: computed(function() {
    return EmberObject.create({ value: 'Hello', show: true });
  }).readOnly(),

  model: computed('rects', 'title', function() {
    let { rects, title } = this;
    return EmberObject.create({ rects, title });
  }).readOnly(),

  opacity: 0.5,

  // TODO: move node defs to models so that I can have sprite-editor model with all the nested konva nodes
  layer: node().owner('opacity').content(function(node) {
    let { opacity } = this;
    let layer = node('wip/layer');
    layer.add(node('wip/rect', { x: 10, y: 10, fill: `rgba(255,0,0,${opacity})` }));
    layer.add(node('wip/rect', { x: 60, y: 60, fill: `rgba(0,255,0,${opacity})` }));
    return layer;
  }),

  stage: node().owner('model', 'layer').content(function(node) {
    let stage = node('wip/stage', { model: this });

    let layer = this.layer;
    stage.add(layer);

    return stage;
  }),

  container: computed(function() {
    return this.element.querySelector('.content');
  }).readOnly(),

  size: computed(function() {
    let { container } = this;
    let { width, height } = container.getBoundingClientRect();
    return { width, height };
  }).readOnly(),

  didInsertElement() {
    this._super(...arguments);

    setGlobal({ component: this });

    let stage = this.stage.build();
    stage.bind(this);

    setGlobal({ stage });
  },

});
