import Entity, { data, render, self } from './entity';
import { model } from 'ember-cli-zuglet/lifecycle';
import { assign } from '@ember/polyfills';

const typed = name => model().named(`project/entities/scene/${name}`).mapping(model => ({ model }))

export default Entity.extend({

  typeName: 'Scene',

  container: self(),

  background: data('background'),

  render: render('scene'),
  layers: typed('layers'),

  onResize(id, diff) {
    let position = assign({}, this.position);
    let size = assign({}, this.size);

    if(id === 'left') {
      position.x -= diff.x;
    } else if(id === 'top') {
      position.y -= diff.y;
    }

    size.width += diff.x;
    size.height += diff.y;

    if(size.width < 1 || size.height < 1) {
      return false;
    }

    this.layers.onParentResized(id, diff);

    this.update({ position, size });
  },

  //

  async didCreateLayer(layer) {
    await this.project.didCreateLayer(layer);
  },

  async didCreateNode(model) {
    await this.project.didCreateNode(model);
  },

  //

  onClick() {
    let selection = this.project.selection.model;
    if(selection && selection.scene === this) {
      selection.parent.select();
    } else {
      this.select();
    }
  }

});
