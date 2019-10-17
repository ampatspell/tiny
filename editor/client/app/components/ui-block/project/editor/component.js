import Component from '@ember/component';
import { readOnly } from '@ember/object/computed';
import KeyboardMixin from 'editor/utils/keyboard';
import { inject as service } from '@ember/service';

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

  tick: service(),

  actions: {
    update(props) {
      this.project.update(props);
    },
    created(stage) {
      this.onCreated(stage);
    },
    destroying() {
      this.onDestroying();
    },
    deselect() {
      this.project.selection.deselect();
    },
    dragStart() {
      this._resume = this.tick.suspend();
    },
    dragEnd() {
      this._resume && this._resume();
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

  toDataURL: stage(function(stage) {
    return stage.toDataURL();
  })

});
