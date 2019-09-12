import Component from '@ember/component';

export default Component.extend({
  classNameBindings: [ ':loop' ],

  state: null,
  loops: null,
  loop: null,

  actions: {
    toggle() {
      this.loop.update({ collapsed: !this.loop.collapsed });
    },
    update(key, value) {
      this.loop.update({ [key]: value });
    }
  }

});
