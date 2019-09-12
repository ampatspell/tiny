module.exports = function(ctx) {

  const admin = require('firebase-admin');

  let app = admin.app();
  let firestore = app.firestore();
  let auth = app.auth();
  let storage = app.storage();
  let bucket = storage.bucket();

  ctx.admin = {
    app,
    auth,
    firestore,
    storage,
    bucket
  };

  // delete is done by test.cleanup()
  return () => {};
};
