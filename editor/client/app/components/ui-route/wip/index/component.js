import Component from '@ember/component';
import { readOnly } from '@ember/object/computed';
import { computed } from '@ember/object';

const sprite = identifier => computed('project.sprites.models.@each.identifier', function() {
  return this.project.sprites.models.findBy('identifier', identifier);
}).readOnly();

const loop = (spriteKey, identifier) => computed(`${spriteKey}.loops.models.@each.identifier`, function() {
  let sprite = this.get(spriteKey);
  if(!sprite) {
    return;
  }
  return sprite.loops.models.findBy('identifier', identifier);
}).readOnly();

const frame = (spriteKey, identifier) => computed(`${spriteKey}.frames.models.@each.identifier`, function() {
  let sprite = this.get(spriteKey);
  if(!sprite) {
    return;
  }
  return sprite.frames.models.findBy('identifier', identifier);
}).readOnly();

export default Component.extend({
  classNameBindings: [ ':ui-route-wip-index' ],

  project: readOnly('model.project'),

  weirdo: sprite('weirdo'),
  bubble: sprite('bubble'),
  building: sprite('building'),

  bubbleIn: loop('bubble', 'in'),

  buildingZero: frame('building', '0'),

});
