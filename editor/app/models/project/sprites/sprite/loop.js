import EmberObject from '@ember/object';
import { readOnly } from '@ember/object/computed';
import ScheduleSave from 'editor/models/-schedule-save';

const doc = path => readOnly(`doc.${path}`);
const data = path => doc(`data.${path}`);

export default EmberObject.extend(ScheduleSave, {

  sprite: null,
  doc: null,

  identifier: data('identifier'),

  async load() {
  },

  async save() {
    await this.doc.save({ token: true });
  },

  async delete() {
    this.cancelScheduledSave();
    await this.doc.delete();
  }

});
