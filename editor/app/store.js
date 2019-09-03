import Store from 'ember-cli-zuglet/store';
import { later } from './utils/runloop';

const options = {
  firebase: {
    apiKey: "AIzaSyDwCGLTmvKCiCxIO9msehKyULJ_rilnEvw",
    authDomain: "quatsch-38adf.firebaseapp.com",
    databaseURL: "https://quatsch-38adf.firebaseio.com",
    projectId: "quatsch-38adf",
    storageBucket: "quatsch-38adf.appspot.com"
  },
  firestore: {
    persistenceEnabled: true
  }
};

export default Store.extend({

  options,

  user: null,

  async restoreUser(user) {
    let current = this.user;
    let next = null;

    this.set('user', null);

    if(user) {
      // temp workaround
      await later(1000);
      next = this.models.create('user', { user });
      await next.restore();
      this.set('user', next);
    }

    if(current) {
      current.destroy();
    }
  }


});
