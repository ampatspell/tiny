import Mixin from '@ember/object/mixin';

export default Mixin.create({

  editor: null, // component

  onEditorCreated(editor) {
    this.setProperties({ editor });
  },

  onEditorDestroying() {
    this.setProperties({ editor: null });
  }

});
