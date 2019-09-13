module.exports = function(ctx) {

  const test = require('firebase-functions-test');
  const config = require('./config');

  let env = config(ctx.environment);
  let instance = test(env.config, env.serviceAccountKey);

  let mockConfig = {
    logging: {
      enabled: process.env.LOGGING ? 'true' : 'false'
    }
  };

  ctx.beforeMockConfig && ctx.beforeMockConfig(mockConfig);

  instance.mockConfig(mockConfig);

  ctx.test = instance;
  ctx.mockConfig = mockConfig;

  ctx.events = {
    get collection() {
      return ctx.admin.firestore.collection('-events');
    },
    async clear() {
      let snapshot = await this.collection.get();
      await Promise.all(snapshot.docs.map(doc => doc.ref.delete()));
    },
    async get() {
      let snapshot = await this.collection.get();
      return snapshot.docs.map(doc => {
        let { id } = doc;
        let data = doc.data();
        Object.defineProperty(data, '_id', { value: id });
        return data;
      });
    }
  }

  ctx.file = {
    async save(path, data, _opts) {
      data = data || 'noop';
      if(!Buffer.isBuffer(data)) {
        data = Buffer.from(data, 'utf-8');
      }
      let opts = {};
      if(_opts) {
        let { token } = _opts;
        if(token) {
          opts.metadata = opts.metadata || {};
          opts.metadata.metadata = opts.metadata.metadata || {};
          opts.metadata.metadata.firebaseStorageDownloadTokens = token;
        }
      }
      return await ctx.admin.bucket.file(path).save(data, opts);
    },
    async delete(path) {
      try {
        return await ctx.admin.bucket.file(path).delete();
      } catch(err) {
        if(err.code === 404) {
          return;
        }
        throw err;
      }
    },
    async exists(path) {
      let [ exists ] = await ctx.admin.bucket.file(path).exists();
      return exists;
    }
  }

  let password = 'heythere';

  ctx.users = {
    async load(email) {
      return await ctx.admin.auth.getUserByEmail(email);
    },
    async create(email) {
      return await ctx.admin.auth.createUser({ email, password });
    },
    async existing(email) {
      try {
        return await this.load(email);
      } catch(err) {
        if(err.code !== 'auth/user-not-found') {
          throw err;
        }
        return await this.create(email);
      }
    },
    async claims(uid, claims) {
      await ctx.admin.auth.setCustomUserClaims(uid, claims);
    }
  }

  return () => instance.cleanup();
}
