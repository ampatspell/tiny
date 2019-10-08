import Render from '../entity/render';

const {
  freeze
} = Object;

export default Render.extend({

  expandable: true,

  inspectorTabs: freeze([
    { id: 'main', label: 'Scene', component: 'scene/main' }
  ]),

});
