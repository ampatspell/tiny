module.exports = app => app.functions.auth.user().onCreate(async user => {

  await app.services.user.onAuthCreate(user);

});
