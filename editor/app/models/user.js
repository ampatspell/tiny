import EmberObject from '@ember/object';
import { readOnly } from '@ember/object/computed';

const user = key => readOnly(`user.${key}`);

export default EmberObject.extend({

  user: null,

  uid:   user('uid'),
  email: user('email'),

  async restore() {
  }

});
