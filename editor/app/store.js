import Store from 'ember-cli-zuglet/store';

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

  options

});
