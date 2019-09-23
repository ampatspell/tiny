import Layer from '../../layer';
import { node } from '../../properties';

export default Layer.extend({

  model: null,

  text: node().owner('model.title').named('konva/wip/title/text').mapping(owner => ({ title: owner.model.title })),

});
