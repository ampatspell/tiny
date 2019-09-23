import Stage from '../stage';
import { node } from '../properties';

export default Stage.extend({

  model: null,

  title: node().named('konva/wip/title/layer').mapping(({ model }) => ({ model })),

  init() {
    this._super(...arguments);
    setGlobal({ stage: this });
  }

});
