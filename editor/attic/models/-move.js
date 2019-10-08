import Mixin from '@ember/object/mixin';

export default Mixin.create({

  async _moveDelta(model, delta) {
    let { ordered } = this;
    let idx = ordered.indexOf(model);
    if(idx === -1) {
      return;
    }

    idx = idx + delta;
    if(idx < 0 || idx > ordered.length - 1) {
      return;
    }

    let next = ordered.objectAt(idx);
    if(!next) {
      return;
    }

    let { index } = model;

    model.doc.data.setProperties({ index: next.index });
    next.doc.data.setProperties({ index });

    await this.store.batch(batch => {
      batch.save(model.doc);
      batch.save(next.doc);
    });
  },

  async moveUp(model) {
    await this._moveDelta(model, +1);
  },

  async moveDown(model) {
    await this._moveDelta(model, -1);
  }

});
