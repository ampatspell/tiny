import Component from '@ember/component';
import EmberObject from '@ember/object';
import { computed } from '@ember/object';
import { A } from '@ember/array';
import { node } from 'editor/models/konva/properties';

export default Component.extend({
  classNameBindings: [ ':ui-route-wip-index' ],

  rects: computed(function() {
    let arr = A();
    let rect = attributes => EmberObject.create({ attributes });
    arr.pushObject(rect({ x: 10, y: 10, width: 50, height: 50, fill: 'rgba(255,0,0,0.1)'}));
    arr.pushObject(rect({ x: 70, y: 10, width: 50, height: 50, fill: 'rgba(255,0,0,0.1)'}));
    return arr;
  }).readOnly(),

  object: computed('rects', function() {
    let { rects } = this;
    let title = EmberObject.create({ value: 'Hello', show: true, type: 'text' });
    return EmberObject.create({ rects, title });
  }).readOnly(),

  // TODO: destroyable
  stage: node().owner('object', 'container', 'size').named(owner => {
    let { container, size } = owner;
    if(!container || !size) {
      return;
    }
    return 'konva/wip/stage';
  }).mapping(({ container, size, object: model }) => ({ container, size, model })),

  didInsertElement() {
    this._super(...arguments);

    let container = this.element.querySelector('.content');
    let { width, height } = container.getBoundingClientRect();
    this.setProperties({ container, size: { width, height } });

    this.stage.model.node;

    setGlobal({ component: this });
  },

});
