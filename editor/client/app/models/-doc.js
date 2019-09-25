import Mixin from '@ember/object/mixin';
import ScheduleSaveMixin from './-schedule-save';
import { doc, data } from 'editor/utils/computed';

export {
  doc,
  data
};

export default Mixin.create(ScheduleSaveMixin, {

  doc: null,

  id: doc('id'),
  ref: doc('ref'),

  async save() {
    await this.doc.save({ token: true });
  },

  update(props) {
    this.doc.data.setProperties(props);
    this.scheduleSave();
  },

  async delete() {
    this.cancelScheduledSave();
    this.isDeleted = true;
    await this.doc.delete();
  }

});
