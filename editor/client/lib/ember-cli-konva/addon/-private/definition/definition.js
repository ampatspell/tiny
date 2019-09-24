import EmberObject, { computed } from '@ember/object';
import { getOwner } from '@ember/application';

export default EmberObject.extend({

  isObserving: false,

  parent: null,
  key: null,
  opts: null,

  node: computed(function() {
    let { parent, opts } = this;
    let factory = getOwner(this).factoryFor('konva:definition/node');
    let build = (name, props={}) => factory.create({ name, props });
    let node = opts.content.call(parent, build);
    this.startObserving();
    return node;
  }).readOnly(),

  parentKeyDidChange() {
    this.notifyPropertyChange('node');
    this.parent.notifyPropertyChange(this.key);
  },

  withObserving(cb) {
    let { parent, opts } = this;
    opts.parent.forEach(key => cb(parent, key));
  },

  startObserving() {
    if(this.isObserving) {
      return;
    }
    this.withObserving((parent, key) => parent.addObserver(key, this, this.parentKeyDidChange));
    this.isObserving = true;
  },

  stopObserving() {
    if(!this.isObserving) {
      return;
    }
    this.withObserving((parent, key) => parent.removeObserver(key, this, this.parentKeyDidChange));
    this.isObserving = false;
  },

  willDestroy() {
    this.stopObserving();
    this._super(...arguments);
  }

});
