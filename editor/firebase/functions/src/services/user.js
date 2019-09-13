let { properties } = require('../util/lazy');

class UserService {

  constructor(app) {
    this.app = app;
  }

  ref(uid) {
    return this.app.firestore.doc(`users/${uid}`);
  }

  async initialize(uid, email, now) {
    now = now || new Date();
    await this.ref(uid).set({ email, createdAt: now });
  }

  //

  async onAuthCreate(user) {
    let { uid, email } = user;
    email = email || null;
    await this.initialize(uid, email);
  }

}

properties(UserService, [], name => require(`./user/${name}`));

module.exports = app => new UserService(app);
