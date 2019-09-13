const setup = require('../helpers/setup');
const assert = require('assert');

describe('trigger / auth', () => {
  setup(this);

  beforeEach(async () => {
    this.doc = path => this.admin.firestore.doc(path);
    this.data = async ref => (await ref.get()).data();
    this.user = await this.users.existing('ampatspell@gmail.com');
  });

  describe('on create', () => {

    beforeEach(() => {
      this.onCreate = this.test.wrap(this.index.auth.onCreate);
      this.now = new Date();
      this.refs = {
        user: this.doc(`users/${this.user.uid}`)
      };
    });

    it('creates user doc', async () => {
      await this.refs.user.delete();
      await this.onCreate({ uid: this.user.uid, email: this.user.email });
      let data = await this.data(this.refs.user);
      assert.deepEqual(data, {
        createdAt: data.createdAt,
        email: this.user.email
      });
    });

  });

});
