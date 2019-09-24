import Layer from '../../layer';
import { node } from '../../properties';

export default Layer.extend({

  model: null,

  text: node().owner('model.title.type').named(owner => `konva/wip/title/${owner.model.title.type}`).mapping(owner => ({ title: owner.model.title })),

});
