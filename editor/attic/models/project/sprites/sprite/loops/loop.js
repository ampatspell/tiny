export default EmberObject.extend(DocMixin, {

  // typeGroup: 'sprites/sprite/loop',
  // typeName: 'Loop',
  // baseTypeName: 'Loop',

  // loops: null,
  // project: readOnly('loops.project'),
  // sprite: readOnly('loops.sprite'),
  // size: readOnly('sprite.size'),

  // identifier: data('identifier'),
  // _frames: data('frames.serialized'),

  // properties: properties(),

  // chainLocked: readOnly('sprite.chainLocked'),

  // render: model().named('project/sprites/sprite/loops/loop/render').mapping(model => ({ model })),

  // frames: computed('_frames.[]', 'sprite.frames.models.@each.id', function() {
  //   let { _frames: ids, sprite: { frames: { models } } } = this;
  //   if(!ids) {
  //     return;
  //   }
  //   return ids.map(id => models.findBy('id', id));
  // }).readOnly(),

  // _framesPreviewRendered: computed('frames.@each._previewRendered', function() {
  //   let { frames } = this;
  //   if(!frames) {
  //     return;
  //   }
  //   return frames.map(frame => frame && frame._previewRendered);
  // }).readOnly(),

  // async load() {
  // },

  _withFrames(cb) {
    let frames = A(this._frames).slice();
    cb(frames);
    this.update({ frames });
  },

  addFrame(frame) {
    if(!frame) {
      return;
    }
    let { id } = frame;
    this._withFrames(frames => frames.push(id));
  },

  removeFrameAtIndex(idx) {
    this._withFrames(frames => frames.removeAt(idx));
  },

  //

  async willDelete() {
    await this._super(...arguments);
    await this.loops.onWillDeleteLoop(this);
  },

  async didDelete() {
    await this._super(...arguments);
    await this.loops.onDidDeleteLoop(this);
  },

  async onWillDeleteFrame(frame) {
    let { id } = frame;
    let frames = A(this._frames);

    if(frames.indexOf(id) === -1) {
      return;
    }

    frames = frames.filter(item => item !== id);
    this.update({ frames });
  },

  async onDidDeleteFrame() {
  }

});
