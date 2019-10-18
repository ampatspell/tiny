module.exports = app => app.functions.firestore.document('projects/{project}/entities/{entity}').onDelete(async snapshot => {

  let { ref: { parent: coll, id } } = snapshot;

  await app.services.firestore.batch(async batch => {
    const rm = async id => {
      let snapshot = await coll.where('parent', '==', id).get();
      await Promise.all(snapshot.docs.map(doc => rm(doc.id)));
      await batch.delete(coll.doc(id));
    }
    await rm(id);
  });

});
