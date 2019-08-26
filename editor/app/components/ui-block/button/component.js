import Component from '@ember/component';

export default Component.extend({
  tagName: 'button',
  classNameBindings: [ ':ui-block-button', 'disabled:disabled:enabled' ],
  attributeBindings: [ 'disabled' ],

  disabled: false,

  click(e) {
    let { shiftKey } = e;
    this.action && this.action({ shiftKey });
  }

});
