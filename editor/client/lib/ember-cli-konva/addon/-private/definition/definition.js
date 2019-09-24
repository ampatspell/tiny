import EmberObject, { computed } from '@ember/object';
import { getOwner } from '@ember/application';

export default EmberObject.extend({

  parent: null,
  key: null,
  opts: null,

  node: computed(function() {
    let { parent, opts } = this;

    let factory = getOwner(this).factoryFor('konva:definition/node');

    let ctx = {
      owner: parent,
      node(name, props={}) {
        return factory.create({ name, props });
      }
    };

    return opts.content.call(ctx, ctx);
  }).readOnly(),

  _isObserving: false,

  _parentKeyDidChange() {
    this.notifyPropertyChange('node');
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

});
