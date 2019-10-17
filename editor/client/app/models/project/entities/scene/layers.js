import filteredEntities from '../../-filtered-entities';

const Layers = filteredEntities('scene/layer');

export default Layers.extend({

  model: null,

  onParentResized(id, diff) {
    this.models.forEach(model => model.onParentResized(id, diff));
  }

});
