module.exports = app => app.functions.firestore.document('projects/{project}').onDelete(async snapshot => {

  let { ref } = snapshot;

  await app.services.firestore.deleteCollection(ref.collection('entities'));

});
