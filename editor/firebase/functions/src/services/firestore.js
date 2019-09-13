class FirestoreService {

  constructor(app) {
    this.app = app;
    this.firestore = app.firestore;
  }

  async _deleteCollection(coll, batch) {
    let snapshots = await coll.select().get();
    if(snapshots.size === 0) {
      return;
    }
    snapshots.docs.map(snapshot => batch.delete(snapshot.ref));
  }

  async deleteCollection(coll) {
    await this.batch(batch => this._deleteCollection(coll, batch));
  }

  async deleteCollections(array) {
    await this.batch(batch => Promise.all(array.map(coll => this._deleteCollection(coll, batch))));
  }

  async batch(cb) {
    let batch = this.firestore.batch();
    let result = await cb(batch);
    await batch.commit();
    return result;
  }

  split(ref) {
    return ref.path.split('/');
  }
}

module.exports = app => new FirestoreService(app);
