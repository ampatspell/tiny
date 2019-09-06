import EmberObject from '@ember/object';
import { readOnly } from '@ember/object/computed';
import ScheduleSave from 'editor/models/-schedule-save';

const doc = path => readOnly(`doc.${path}`);
const data = path => doc(`data.${path}`);

export default EmberObject.extend(ScheduleSave, {

  world: null,
  doc: null,

  name: data('name'),
  identifier: data('identifier'),

  async save() {
    await this.doc.save({ token: true });
  },

  async delete() {
    await this.doc.delete();
  }

});
