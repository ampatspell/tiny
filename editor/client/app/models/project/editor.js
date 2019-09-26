import Mixin from '@ember/object/mixin';
import EmberObject from '@ember/object';
import { model } from 'ember-cli-zuglet/lifecycle';

export const EditorMixin = Mixin.create({

  _editor: null, // component

  editor: model().owner('_editor').named('project/editor').mapping(project => {
    let { _editor: component } = project;
    if(!component) {
      return;
    }
    return { project, component };
  }),

  onEditorCreated(_editor) {
    this.setProperties({ _editor });
  },

  onEditorDestroying() {
    this.setProperties({ _editor: null });
  }

});

export default EmberObject.extend({

  project: null,
  component: null,

  center() {
    this.component.center();
  }

});