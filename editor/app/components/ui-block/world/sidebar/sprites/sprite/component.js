import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
  classNameBindings: [ ':sprite' ],
  attributeBindings: [ 'draggable' ],

  draggable: true,

  state: null,
  sprite: null,

  size: computed('state.pixel', 'sprite.size', function() {
    let { sprite: { size }, state: { pixel } } = this;
    let calc = key => size[key] * pixel;
    return {
      width: calc('width'),
      height: calc('height')
    };
  }).readOnly(),

  click() {
    this.select();
  },

  dragStart(e) {
    let dragImage = this.element.querySelector('.drag-image');
    e.dataTransfer.setData('text/data', { type: 'sprite', id: this.sprite.id });
    e.dataTransfer.setDragImage(dragImage, 0, 0);
  }

});
