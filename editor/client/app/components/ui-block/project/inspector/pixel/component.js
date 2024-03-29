import Component from '@ember/component';
import { readOnly } from '@ember/object/computed';

export default Component.extend({
  classNameBindings: [ ':ui-block-project-inspector-pixel' ],

  pixel: readOnly('project.pixel'),

  actions: {
    update(pixel) {
      pixel = parseInt(pixel);
      if(isNaN(pixel)) {
        return;
      }
      this.project.update({ pixel });
    },
    center() {
      let { project: { editor } } = this;
      editor && editor.center();
    },
    fit() {
      let { project: { editor } } = this;
      editor && editor.fit();
    }
  }

});
