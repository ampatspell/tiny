import EmberObject from '@ember/object';
import { notBlank } from 'editor/utils/computed';
import { readOnly, and, not, or } from '@ember/object/computed';
import alive from 'editor/utils/alive';

export default EmberObject.extend({

  uid: readOnly('store.user.uid'),

  name: null,
  identifier: null,

  hasName: notBlank('name'),

  isValid: and('hasName'),
  isInvalid: not('isValid'),
  isBusy: false,
  isDisabled: or('isInvalid', 'isBusy'),

  prepare(route) {
    let { project } = route.modelFor('projects.project');
    this.setProperties({ project });
  },

  update(props) {
    this.setProperties(props);
  },

  async save() {
    this.setProperties({ isBusy: true });
    let { name, project: { doc: { ref } } } = this;
    let doc = ref.collection('worlds').doc().new({
      name
    });
    await doc.save();
    this.didSave(doc.id);
  },

  didSave: alive(function(id) {
    this.router.transitionTo('projects.project.worlds.world', id);
  })

});
