import Component from '@ember/component';
import { computed } from '@ember/object';

let base = 'https://felipemanga.github.io/ProjectABE/?skin=BareFit&color=FFFFFF&url='

export default Component.extend({
  classNameBindings: [ ':ui-route-emulators-hex' ],

  url: computed('model.url', function() {
    let { model: { url } } = this;
    return `${base}${encodeURIComponent(url)}`;
  }).readOnly(),

});
