import EmberObject, { computed } from '@ember/object';
import { getOwner } from '@ember/application';

export default EmberObject.extend({

  isObserving: false,

  parent: null,
  key: null,
  opts: null,

  definition: null,

  bind() {
    console.log('bind', this.key);
    this.createDefinition();
    this.bindDefinition();
  },

  bindDefinition() {
    let { definition } = this;
    if(!definition) {
      return;
    }
    definition.bind();
  },

  // bind() {
  //   this.createModel();
  //   this.startObserving();
  // },

  // createModel() {
  //   let { definition } = this;
  //   if(!definition) {
  //     return;
  //   }
  //   definition.createModel();
  // },

  createDefinition() {
    let { definition } = this;
    if(definition) {
      return;
    }
    let { parent, opts } = this;
    let factory = getOwner(this).factoryFor('konva:definition');
    let build = (type, props={}) => factory.create({ parent, type, props });
    definition = opts.content.call(parent, build);
    this.setProperties({ definition });
  },

  //

  //

  //

  // parentKeyDidChange() {
  //   // this.notifyPropertyChange('node');
  //   // this.parent.notifyPropertyChange(this.key);
  // },

  // withObserving(cb) {
  //   let { parent, opts } = this;
  //   opts.parent.forEach(key => cb(parent, key));
  // },

  // startObserving() {
  //   if(this.isObserving) {
  //     return;
  //   }
  //   this.withObserving((parent, key) => parent.addObserver(key, this, this.parentKeyDidChange));
  //   this.isObserving = true;
  // },

  // stopObserving() {
  //   if(!this.isObserving) {
  //     return;
  //   }
  //   this.withObserving((parent, key) => parent.removeObserver(key, this, this.parentKeyDidChange));
  //   this.isObserving = false;
  // },

  // willDestroy() {
  //   this.stopObserving();
  //   this._super(...arguments);
  // }

});
