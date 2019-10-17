import Entity, { data, render, self } from './entity';
import { properties } from '../properties';
import { model } from 'ember-cli-zuglet/lifecycle';
import { assign } from '@ember/polyfills';

const typed = name => model().named(`project/entities/sprite/${name}`).mapping(model => ({ model }))

export default Entity.extend({

  typeName: 'Sprite',

  container: self(),

  pixel: data('pixel'),
  background: data('background'),
  properties: properties(),

  render: render('sprite'),

  frames: typed('frames'),
  loops:  typed('loops'),

  resize(handle, diff) {
    if(diff.x === 0 && diff.y === 0) {
      return false;
    }

    let size = assign({}, this.size);
    size.width += diff.x;
    size.height += diff.y;

    if(size.width < 1 || size.height < 1) {
      return false;
    }

    let pixel = this.pixel;
    let position = assign({}, this.position);
    if(handle === 'left') {
      position.x -= (diff.x * pixel);
    } else if(handle === 'top') {
      position.y -= (diff.y * pixel);
    }

    this.frames.resize(handle, size);
    this.update({ size, position });

    return true;
  },

  onResize(id, diff) {
    this.resize(id, diff);
  }

});
