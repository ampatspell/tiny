import Component from '@ember/component';

export default Component.extend({
  classNameBindings: [ ':ui-route-projects-project-sprites-new' ],

  actions: {
    update(key, value) {
      this.model.update({ [key]: value });
    },
    save() {
      this.model.save();
    }
  }

});
