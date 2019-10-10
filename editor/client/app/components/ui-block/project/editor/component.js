import Component from '@ember/component';
import { readOnly } from '@ember/object/computed';
import KeyboardMixin from 'editor/utils/keyboard';

const stage = cb => function(...args) {
  let { stage } = this;
  if(!stage) {
    return;
  }
  return cb.call(this, stage, ...args);
}

export default Component.extend(KeyboardMixin, {
  classNameBindings: [ ':ui-block-project-editor' ],

  stage: null,
  size: readOnly('stage.size'),

  actions: {
    update(props) {
      this.project.update(props);
    },
    created(stage) {
      setGlobal({ stage });
      this.onCreated(stage);
    },
    destroying() {
      this.onDestroying();
    },
    deselect() {
      this.project.selection.deselect();
    }
  },

  onCreated(stage) {
    this.set('stage', stage);
    this.project.onEditorCreated(this);
  },

  onDestroying() {
    this.project.onEditorDestroying(this);
    this.set('stage', null);
  },

  //

  onDigit(value) {
    // this.project.onShortcutDigit(value);
  },

  onUp() {
    // this.project.onShortcutUp();
  },

  onDown() {
    // this.project.onShortcutDown();
  },

  onLeft() {
    // this.project.onShortcutLeft();
  },

  onRight() {
    // this.project.onShortcutRight();
  },

  onEscape() {
    // this.project.onShortcutEscape();
  },

  //

  center: stage(function(stage) {
    stage.center();
  }),

  toDataURL: stage(function(stage) {
    return stage.toDataURL();
  })

});
