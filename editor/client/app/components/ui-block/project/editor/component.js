import Component from '@ember/component';
import KeyboardMixin from 'editor/utils/keyboard';
import { readOnly } from '@ember/object/computed';

const stage = cb => function(...args) {
  let { stage } = this;
  if(!stage) {
    return;
  }
  return cb.call(this, stage, ...args);
}

export default Component.extend(KeyboardMixin, {
  classNameBindings: [ ':ui-block-project-editor' ],

  draggable: readOnly('isSpacePressed'),

  stage: null,

  actions: {
    created(stage) {
      this.onCreated(stage);
    },
    destroying() {
      this.onDestroying();
    },
    deselect() {
      this.project.deselect();
    }
  },

  onCreated(stage) {
    this.set('stage', stage);
    this.project.onEditorCreated(this);
  },

  onDestroying() {
    this.state.onEditorDestroying(this);
    this.set('stage', null);
  },

  //

  center: stage(function(stage) {
    stage.center();
  }),

  toDataURL: stage(function(stage) {
    return stage.toDataURL();
  })

});
