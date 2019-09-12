import Component from '@ember/component';

export default Component.extend({
  classNameBindings: [ ':ui-block-textarea', 'disabled:disabled' ],
  attributeBindings: [ 'disabled', 'readonly' ],

  tagName: 'textarea',

  disabled: false,
  readonly: false,

  input(e) {
    this._update(e, false);
  },

  focusOut(e) {
    this._update(e, true);
  },

  _update(e, focus) {
    let value = e.target.value;
    if(value === String(this.value)) {
      return;
    }
    this.update && this.update(value, focus);
  }

});
