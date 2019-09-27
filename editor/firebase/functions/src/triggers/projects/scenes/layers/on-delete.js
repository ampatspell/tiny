module.exports = app => app.functions.firestore.document('projects/{project}/scenes/{scene}/layers/{layer}').onDelete(async snapshot => {

  let { ref } = snapshot;

  await app.services.firestore.deleteCollection(ref.collection('nodes'));

});
