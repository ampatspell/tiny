import Mixin from '@ember/object/mixin';
import EmberObject from '@ember/object';
import { readOnly } from '@ember/object/computed';
import { model } from 'ember-cli-zuglet/lifecycle';
import alive from 'editor/utils/alive';

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

  onEditorDestroying: alive(function() {
    this.setProperties({ _editor: null });
  })

});

export default EmberObject.extend({

  project: null,
  component: null,

  isSpacePressed: readOnly('component.isSpacePressed'),
  isAltPressed:   readOnly('component.isAltPressed'),

  size: readOnly('component.size'),

  center() {
    let { project: { render: { absolute: project } }, size } = this;

    if(!project) {
      return;
    }

    let calc = (a, s) => Math.round((size[s] / 2) - (project[s] / 2) - project[a]);

    let origin = {
      x: calc('x', 'width'),
      y: calc('y', 'height')
    };

    this.project.update({ origin });
  },

  fit() {
    let { project: { pixel, render: { absolute: project } }, size } = this;

    if(!project) {
      return;
    }

    let calc = s => Math.floor((size[s] * pixel) / project[s]);

    pixel = Math.min(Math.max(1, Math.min(calc('width'), calc('height'))), 8);

    this.project.update({ pixel });
    this.center();
  }

});
