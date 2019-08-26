import Component from '@ember/component';

export default Component.extend({
  tagName: 'input',

  classNameBindings: [ ':ui-block-input', 'disabled:disabled:enabled' ],

  attributeBindings: [
    'placeholder',
    'value',
    'autofocus',
    'spellcheck',
    'autocapitalize',
    'autocorrect',
    'autocomplete',
    'type',
    'disabled'
  ],

  placeholder: null,
  value: null,
  autofocus: false,
  spellcheck: false,
  autocapitalize: 'off',
  autocorrect: 'off',
  autocomplete: 'off',
  type: 'text',
  disabled: false,

  delayed: false,

  didInsertElement() {
    this._super(...arguments);
    if(this.focus) {
      this.element.focus();
    }
  },

  input(e) {
    this._update(e, false);
  },

  focusOut(e) {
    if(this.delayed) {
      e.target.value = this.value;
    } else {
      this._update(e, true);
    }
  },

  changed(e) {
    let value = e.target.value;
    if(value === String(this.value)) {
      return false;
    }
    return true;
  },

  keyPress(e) {
    if(e.keyCode == 13 || e.which == 13) {
      if(this.enter && this.changed(e)) {
        this.enter(e.target.value);
      }
    }
  },

  _update(e, focus) {
    if(this.update && this.changed(e)) {
      this.update(e.target.value, focus);
    }
  }

});
