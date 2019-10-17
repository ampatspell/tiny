export default EmberObject.extend(DocMixin, {

  // typeGroup: 'sprites/sprite/frame',
  // typeName: 'Frame',

  // project: readOnly('frames.project'),
  // sprite: readOnly('frames.sprite'),
  // size: readOnly('sprite.size'),

  // index: data('index'),
  // identifier: data('identifier'),
  // bytes: data('bytes'),

  // properties: properties(),

  // preview: model().named('project/sprites/sprite/frames/frame/preview').mapping(frame => ({ frame })),

  // _previewRendered: readOnly('preview.rendered'),

  // async load() {
  // },

  //

  // _didUpdateBytes() {
  //   this.notifyPropertyChange('bytes');
  //   this.scheduleSave();
  // },

  // _replaceBytes(bytes) {
  //   this.doc.set('data.bytes', bytes);
  //   this._didUpdateBytes();
  // },

  // _withBytes(cb) {
  //   let { bytes } = this;
  //   if(!bytes) {
  //     return;
  //   }
  //   let mutated = cb(bytes);
  //   if(mutated === false) {
  //     return;
  //   }
  //   this._didUpdateBytes();
  // },

  // setPixel(index, value) {
  //   this._withBytes(bytes => {
  //     if(bytes[index] === value) {
  //       return false;
  //     }
  //     bytes[index] = value;
  //   });
  // },

  // fill(value) {
  //   this._withBytes(bytes => bytes.fill(value));
  // },

  // invert() {
  //   this._withBytes(bytes => bytes.forEach((value, index) => {
  //     if(value === 0) {
  //       return;
  //     }
  //     bytes[index] = value === 1 ? 2 : 1;
  //   }));
  // },

  // _select(bytes, frame) {
  //   let { size } = this;
  //   let cols = [];
  //   for(let y = frame.y; y < frame.y + frame.height; y++) {
  //     let row = [];
  //     cols.push(row);
  //     for(let x = frame.x; x < frame.x + frame.width; x++) {
  //       let index = toIndex(x, y, size);
  //       row.push(bytes[index]);
  //     }
  //   }
  //   return cols;
  // },

  // _clear(bytes, frame) {
  //   let { size } = this;
  //   for(let y = frame.y; y < frame.y + frame.height; y++) {
  //     for(let x = frame.x; x < frame.x + frame.width; x++) {
  //       let index = toIndex(x, y, size);
  //       bytes[index] = Pixel.transparent;
  //     }
  //   }
  // },

  // _write(bytes, target, selection) {
  //   let { size } = this;
  //   for(let y = 0; y < selection.length; y++) {
  //     let ty = target.y + y;
  //     if(ty < 0 || ty > size.height - 1) {
  //       continue;
  //     }
  //     let row = selection[y];
  //     for(let x = 0; x < row.length; x++) {
  //       let tx = target.x + x;
  //       if(tx < 0 || tx > size.width - 1) {
  //         continue;
  //       }
  //       let value = row[x];
  //       if(value === Pixel.transparent) {
  //         continue;
  //       }
  //       let index = toIndex(tx, ty, size);
  //       bytes[index] = value;
  //     }
  //   }
  // },

  // beginMove(source) {
  //   let pristine = this.bytes.slice();
  //   let selection = this._select(pristine, source);
  //   return target => {
  //     let bytes = pristine.slice();
  //     this._clear(bytes, source);
  //     this._write(bytes, target, selection);
  //     this._replaceBytes(bytes);
  //   }
  // },

  //

  // _resize(handle, size) {
  //   this.cancelScheduledSave();

  //   let source = {
  //     bytes: new Uint8Array(this.bytes),
  //     size: this.size
  //   };

  //   let target = {
  //     bytes: new Uint8Array(size.width * size.height),
  //     size
  //   };

  //   for(let y = 0; y < source.size.height; y++) {
  //     for(let x = 0; x < source.size.width; x++) {
  //       let value = source.bytes[toIndex(x, y, source.size)];
  //       if(handle === 'right' || handle === 'bottom') {
  //         target.bytes[toIndex(x, y, target.size)] = value;
  //       } else if(handle === 'top') {
  //         let d = target.size.height - source.size.height;
  //         let ty = y + d;
  //         target.bytes[toIndex(x, ty, target.size)] = value;
  //       } else if(handle === 'left') {
  //         let d = target.size.width - source.size.width;
  //         let tx = x + d;
  //         if(tx >= 0) {
  //           target.bytes[toIndex(tx, y, target.size)] = value;
  //         }
  //       }
  //     }
  //   }

  //   let { doc } = this;
  //   doc.set('data.bytes', target.bytes);
  //   return doc;
  // },

  willDelete() {
    this._super(...arguments);
    this.frames.onWillDeleteFrame(this);
  },

  didDelete() {
    this._super(...arguments);
    this.frames.onDidDeleteFrame(this);
  },

});
