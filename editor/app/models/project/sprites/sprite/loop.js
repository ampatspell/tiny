import EmberObject, { computed } from '@ember/object';
import { readOnly } from '@ember/object/computed';
import ScheduleSave from 'editor/models/-schedule-save';
import { A } from '@ember/array';

const doc = path => readOnly(`doc.${path}`);
const data = path => doc(`data.${path}`);

export default EmberObject.extend(ScheduleSave, {

  sprite: null,
  doc: null,

  locked: readOnly('sprite.locked'),

  identifier: data('identifier'),
  _frames: data('frames.serialized'),

  frames: computed('_frames', 'sprite.frames.@each.id', function() {
    let { _frames: ids, sprite: { frames } } = this;
    if(!ids) {
      return;
    }
    return ids.map(id => frames.findBy('id', id));
  }).readOnly(),

  _framesPreviewRendered: computed('frames.@each._previewRendered', function() {
    let { frames } = this;
    if(!frames) {
      return;
    }
    return frames.map(frame => frame && frame._previewRendered);
  }).readOnly(),

  async load() {
  },

  async save() {
    await this.doc.save({ token: true });
  },

  update(props) {
    this.doc.data.setProperties(props);
    this.scheduleSave();
  },

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

  onFrameDeleted(frame) {
    let { id } = frame;

    let frames = A(this._frames);
    if(frames.indexOf(id) === -1) {
      return;
    }

    frames = frames.filter(item => item !== id);
    this.update({ frames });
  },

  //

  async delete() {
    this.cancelScheduledSave();
    await this.doc.delete();
  }

});
