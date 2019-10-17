export default Sprite.extend({

  // typeName: 'Sprite Loop Node',

  // _loop: data('loop'),
  // spriteLoops: readOnly('sprite.loops.ordered'),

  // spriteLoop: computed('spriteLoops.@each.identifier', '_loop', function() {
  //   let { spriteLoops, _loop: identifier } = this;
  //   if(!spriteLoops || !identifier) {
  //     return;
  //   }
  //   return spriteLoops.findBy('identifier', identifier);
  // }).readOnly(),

  onLoop(loop) {
    let { sprite, identifier } = loop;
    if(!this.onSprite(sprite)) {
      return;
    }
    this.update({ loop: identifier });
  }

});
