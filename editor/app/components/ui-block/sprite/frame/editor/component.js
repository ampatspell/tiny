import Component from '@ember/component';
import { readOnly } from '@ember/object/computed';
import KeyboardMixin from 'editor/utils/keyboard';

const frame = key => readOnly(`frame.${key}`);

export default Component.extend(KeyboardMixin, {
  classNameBindings: [ ':ui-block-sprite-frame-editor' ],

  size: frame('size'),
  bytes: frame('bytes'),

  actions: {
    created(stage) {
      stage.node.setAttrs({ x: 15, y: 15 });
    },
    update(index, value) {
      this.update(index, value);
    },
    resize(id, diff) {
      this.resize(id, diff);
    }
  }

});
