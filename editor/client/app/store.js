import Store from 'ember-cli-zuglet/store';
import { computed } from '@ember/object';
import { getOwner } from '@ember/application';
import { later } from './util/runloop';

const firestore = {
  persistenceEnabled: true
};

export default Store.extend({

  options: computed(function() {
    let {
      editor: {
        firebase
      }
    } = getOwner(this).factoryFor('config:environment').class;

    return {
      firebase,
      firestore
    };
  }).readOnly(),

  user: null,

  async restoreUser(user) {
    let current = this.user;
    let next = null;

    this.set('user', null);

    if(user) {
      // temp workaround
      await later(100);
      next = this.models.create('user', { user });
      await next.restore();
      this.set('user', next);
    }

    if(current) {
      current.destroy();
    }
  }

});
