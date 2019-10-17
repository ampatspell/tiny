import Render from './-render';
import { readOnly } from '@ember/object/computed';
import { bounds } from 'editor/utils/computed';

const {
  freeze
} = Object;

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

  absolute: bounds('model.entities.visible', '_renderAbsolute'),

  highlight: null,
  draggable: false

});
