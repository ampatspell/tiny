module.exports = app => app.functions.firestore.document('projects/{project}/worlds/{world}').onDelete(async snapshot => {

  let { ref } = snapshot;

  await Promise.all([
    app.services.firestore.deleteCollection(ref.collection('scenes')),
    app.services.storage.deleteFile(`${ref.path}/thumbnail.png`, { optional: true })
  ]);

});
