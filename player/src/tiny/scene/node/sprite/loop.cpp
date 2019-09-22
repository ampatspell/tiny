#include <avr/pgmspace.h>
#include <Arduboy2.h>
#include <globals.h>
#include <tiny/scene/node/sprite/loop.h>
#include <tiny/sprite/loop.h>
#include <tiny/sprite/sprite.h>

namespace Tiny {

SpriteLoopNode::SpriteLoopNode(Layer *_layer, const uint8_t *_definition) :
    SpriteNode(_layer, _definition), index(0) {
  uint8_t index = pgm_read_byte(definition + 3);
  loop = sprite->loopAtIndex(index);
}

void SpriteLoopNode::draw() {
  if (arduboy.everyXFrames(7)) {
    index = loop->next(index);
  }
  loop->draw(x, y, index);
}

}
