import Component from '@ember/component';
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
    this.project.onEditorDestroying(this);
    this.set('stage', null);
  },

  //

  onDigit(value) {
    this.project.onShortcutDigit(value);
  },

  onLeft() {
    this.project.onShortcutLeft();
  },

  onRight() {
    this.project.onShortcutRight();
  },

  onEscape() {
    this.project.onShortcutEscape();
  },

  //

  center: stage(function(stage) {
    stage.center();
  }),

  toDataURL: stage(function(stage) {
    return stage.toDataURL();
  })

});
