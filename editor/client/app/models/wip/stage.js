import Stage from 'ember-cli-konva/models/stage';
import { node } from 'ember-cli-konva';

export default Stage.extend({

  opacity: 0.5,

  layer: node().owner('opacity').content(function(node) {
    let { opacity } = this;
    let layer = node('wip/layer');
    layer.add(node('wip/rect', { x: 10, y: 10, fill: `rgba(255,0,0,${opacity})` }));
    layer.add(node('wip/rect', { x: 60, y: 60, fill: `rgba(0,255,0,${opacity})` }));
    return layer;
  })

});
