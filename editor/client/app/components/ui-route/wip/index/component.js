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

  stage: node().owner('model').content(function() {
    let stage = this.node('wip/stage', { model: this.owner });

    let layer = this.node('wip/layer');
    stage.add(layer);

    let rect = this.node('wip/rect', { x: 10, y: 10 });
    layer.add(rect);

    return stage;
  }),

  didInsertElement() {
    this._super(...arguments);

    // let container = this.element.querySelector('.content');
    // let { width, height } = container.getBoundingClientRect();

    setGlobal({ component: this });
  },

});
