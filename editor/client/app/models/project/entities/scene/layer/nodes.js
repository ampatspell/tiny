import filteredEntities from '../../../-filtered-entities';

const Nodes = filteredEntities('scene/layer/node');

export default Nodes.extend({

  model: null,

  onParentResized(id, diff) {
    this.models.forEach(model => model.onParentResized(id, diff));
  }

});
