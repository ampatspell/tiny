import EmberObject from '@ember/object';
import { notBlank } from 'editor/utils/computed';
import { readOnly, and, not, or } from '@ember/object/computed';
import alive from 'editor/utils/alive';

export default EmberObject.extend({

  uid: readOnly('store.user.uid'),

  name: null,
  identifier: null,

  hasName: notBlank('name'),
  hasIdentifier: notBlank('identifier'),

  isValid: and('hasName', 'hasIdentifier'),
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
    let { name, identifier, project: { doc: { ref } } } = this;
    let doc = ref.collection('sprites').doc().new({
      name,
      identifier,
      size: {
        width: 16,
        height: 16
      }
    });
    await doc.save();
    this.didSave(doc.id);
  },

  didSave: alive(function(id) {
    this.router.transitionTo('projects.project.sprites.sprite', id);
  }),

});
