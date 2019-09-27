import EmberObject, { computed } from '@ember/object';
import { equal } from '@ember/object/computed';
import { defer } from 'rsvp';

const status = value => equal('status', value).readOnly();

export default EmberObject.extend({

  dialogs: null,
  presenter: null,

  dialog: null,
  promise: null,

  status: null,
  error: null,

  isConfirmed: status('confirmed'),
  isRejected: status('rejected'),
  isCancelled: status('cancelled'),

  componentName: computed('dialog', function() {
    let { dialog } = this;
    return `ui-dialog/${dialog}`;
  }).readOnly(),

  init() {
    this._super(...arguments);
    this._deferred = defer();
    this.promise = this._deferred.promise;
  },

  _done() {
    this.dialogs._remove(this);
  },

  resolve(props) {
    this.setProperties(props);
    this._deferred.resolve(this);
    this._done();
  },

  reject(err) {
    this.setProperties({ status: 'rejected', error: err });
    this._deferred.reject(err);
    this._done();
  },

  confirm() {
    this.resolve({ status: 'confirmed' });
  },

  cancel() {
    this.resolve({ status: 'cancelled' });
  },

  toStringExtension() {
    return this.dialog;
  }

});
