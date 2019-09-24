import Component from '@ember/component';
import EmberObject from '@ember/object';
import { computed } from '@ember/object';
import { A } from '@ember/array';

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

    let { model } = this;
    let stage = this.store.models.create('wip/stage', { model });
    stage.bind(this);

    setGlobal({ stage });
  },

});
