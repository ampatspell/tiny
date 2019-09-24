import EmberObject, { computed } from '@ember/object';
import { getOwner } from '@ember/application';

export default EmberObject.extend({

  parent: null,
  key: null,
  opts: null,

  _isObserving: false,

  node: computed(function() {
    let { parent, opts } = this;

    let factory = getOwner(this).factoryFor('konva:definition/node');

    let ctx = {
      owner: parent,
      node(name, props={}) {
        return factory.create({ name, props });
      }
    };

    let node = opts.content.call(ctx, ctx);
    this._startObserving();
    return node;
  }).readOnly(),

  _parentKeyDidChange() {
    this.notifyPropertyChange('node');
    this.parent.notifyPropertyChange(this.key);
  },

  _withObserving(cb) {
    let { parent, opts } = this;
    opts.parent.forEach(key => cb(parent, key));
  },

  _startObserving() {
    if(this._isObserving) {
      return;
    }
    this._withObserving((parent, key) => parent.addObserver(key, this, this._parentKeyDidChange));
    this._isObserving = true;
  },

  _stopObserving() {
    if(!this._isObserving) {
      return;
    }
    this._withObserving((parent, key) => parent.removeObserver(key, this, this._parentKeyDidChange));
    this._isObserving = false;
  },

  willDestroy() {
    this._stopObserving();
    this._super(...arguments);
  }

});
