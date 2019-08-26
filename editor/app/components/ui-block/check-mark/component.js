import Component from '@ember/component';

export default Component.extend({
  classNameBindings: [ ':ui-block-ckeckmark', 'disabled:disabled:enabled', 'value:checked' ],

  value: false,
  disabled: false,

  click() {
    let { disabled, value } = this;
    if(disabled) {
      return;
    }
    this.update && this.update(!value);
  }

});
