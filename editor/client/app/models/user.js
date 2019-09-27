import EmberObject, { computed } from '@ember/object';
import { readOnly } from '@ember/object/computed';

const user = key => readOnly(`user.${key}`);

export default EmberObject.extend({

  user: null,

  uid:   user('uid'),
  email: user('email'),

  ref: computed('uid', function() {
    let { uid } = this;
    if(!uid) {
      return;
    }
    return this.store.doc(`users/${uid}`);
  }).readOnly(),

  async restore() {
  }

});
