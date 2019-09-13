module.exports = app => app.functions.firestore.document('projects/{project}/sprites/{sprite}').onDelete(async snapshot => {

  let { ref } = snapshot;

  await Promise.all([
    app.services.firestore.deleteCollections([
      ref.collection('frames'),
      ref.collection('loops')
    ]),
    app.services.storage.deleteFile(`${ref.path}/thumbnail.gif`, { optional: true })
  ]);

});
