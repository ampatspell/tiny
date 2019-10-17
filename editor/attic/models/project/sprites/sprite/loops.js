export default EmberObject.extend({

  // typeName: 'Loops',

  // project: readOnly('sprite.project'),

  // sprite: null,

  // ref: computed('sprite.ref', function() {
  //   let { sprite: { ref } } = this;
  //   return ref.collection('loops');
  // }).readOnly(),

  // query: observed().owner('ref').content(({ ref }) => ref.query()),
  // models: models('query.content').named('project/sprites/sprite/loops/loop').mapping((doc, loops) => ({ loops, doc })),

  // ordered: computed('models.@each.identifier', function() {
  //   return this.models.sortBy('identifier');
  // }).readOnly(),

  // identified: computed('ordered.@each.identifier', function() {
  //   return this.ordered.filter(model => !!model.identifier);
  // }).readOnly(),

  //

  // selected:  null,

  // select(selected) {
  //   selected = selected || null;
  //   this.setProperties({ selected });
  // },

  //

  // async load({ type }) {
  //   await resolveObservers(this.query);
  //   await all(this.models.map(model => model.load({ type })));
  // },

  async create() {
    let frames = this.sprite.frames.ordered.map(frame => frame.id);

    let doc = this.ref.doc().new({
      identifier: 'new-loop',
      frames
    });

    await doc.save();
    return this.models.findBy('id', doc.id);
  },

  //

  async onWillDeleteLoop(loop) {
    if(this.selected === loop) {
      this.select(null);
    }
    await this.sprite.onWillDeleteLoop(loop);
  },

  async onDidDeleteLoop(loop) {
    await this.sprite.onDidDeleteLoop(loop);
  },

  async onWillDeleteFrame(frame) {
    await all(this.ordered.map(loop => loop.onWillDeleteFrame(frame)));
  },

  async onDidDeleteFrame(frame) {
    await all(this.ordered.map(loop => loop.onDidDeleteFrame(frame)));
  }

});
