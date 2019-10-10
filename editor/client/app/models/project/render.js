import Render from './-render';
import { computed } from '@ember/object';
import { readOnly } from '@ember/object/computed';

const {
  freeze
} = Object;

const absolute = (arrayKey, propertyKey) => computed(`model.entities.${arrayKey}.@each.${propertyKey}`, function() {
  let entities = this.get(`model.entities.${arrayKey}`);

  if(entities.length === 0) {
    return {
      x: 0,
      y: 0,
      width: 0,
      height: 0
    };
  }

  let box = {
    min: {
      x: Number.POSITIVE_INFINITY,
      y: Number.POSITIVE_INFINITY,
    },
    max: {
      x: Number.NEGATIVE_INFINITY,
      y: Number.NEGATIVE_INFINITY,
    }
  };

  entities.forEach(entity => {
    let frame = entity._renderAbsolute;
    box.min.x = Math.min(box.min.x, frame.x);
    box.min.y = Math.min(box.min.y, frame.y);
    box.max.x = Math.max(box.max.x, frame.x + frame.width);
    box.max.y = Math.max(box.max.y, frame.y + frame.height);
  });

  return {
    x:      box.min.x,
    y:      box.min.y,
    width:  box.max.x - box.min.x,
    height: box.max.y - box.min.y,
  };
}).readOnly();

export default Render.extend({

  expandable: true,

  pixel: readOnly('model.pixel'),

  hidden: readOnly('model.hidden'),
  locked: readOnly('model.locked'),

  inspectorTabs: freeze([
    { id: 'main',   label: 'Project', component: 'project/main' },
    { id: 'exttas', label: 'Manage',  component: 'project/extras' },
  ]),

  frame: freeze({ x: 0, y: 0 }),

  absolute: absolute('visible', '_renderAbsolute'),

  selection: computed('model.selection.model', function() {
    let { model: { selection: { model } } } = this;
    if(!model) {
      return;
    }
    return [ model ];
  }).readOnly(),

});
