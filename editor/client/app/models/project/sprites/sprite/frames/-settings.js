import Mixin from '@ember/object/mixin';
import { readOnly } from '@ember/object/computed';
import { assign } from '@ember/polyfills';

export default Mixin.create({

  sprite: null,
  settings: readOnly('sprite.doc.data.frames.serialized'),

  update(props) {
    let frames = assign({}, this.settings || {}, props);
    this.sprite.update({ frames });
  }

});
