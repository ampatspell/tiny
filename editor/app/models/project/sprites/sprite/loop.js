import EmberObject from '@ember/object';
import { readOnly } from '@ember/object/computed';
import ScheduleSave from 'editor/models/-schedule-save';

const doc = path => readOnly(`doc.${path}`);
const data = path => doc(`data.${path}`);

export default EmberObject.extend(ScheduleSave, {

  sprite: null,
  doc: null,

  identifier: data('identifier'),
  collapsed: data('collapsed'),

  async load() {
  },

  async save() {
    await this.doc.save({ token: true });
  },

  update(props) {
    this.doc.data.setProperties(props);
    this.scheduleSave();
  },

  async delete() {
    this.cancelScheduledSave();
    await this.doc.delete();
  }

});
