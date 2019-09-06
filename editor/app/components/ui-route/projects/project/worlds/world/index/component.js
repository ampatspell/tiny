import Component from '@ember/component';
import { readOnly } from '@ember/object/computed';
import { model } from 'ember-cli-zuglet/lifecycle';

export default Component.extend({
  classNameBindings: [ ':ui-route-projects-project-worlds-world-index' ],

  world: readOnly('model.world'),

  state: model().owner('sprite').inline({

    world: null,
    editor: null,

    onEditorCreated(editor) {
      this.setProperties({ editor });
    }

  }).mapping(({ world }) => ({ world })),

  actions: {
    created(editor) {
      this.state.onEditorCreated(editor);
    },
  }

});
