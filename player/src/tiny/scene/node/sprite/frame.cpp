#include <avr/pgmspace.h>
#include <tiny/scene/node/sprite/frame.h>
#include <tiny/sprite/sprite.h>

namespace Tiny {

SpriteFrameNode::SpriteFrameNode(const Layer *_layer, const uint8_t *_definition) :
    SpriteNode(_layer, _definition) {
  frame = pgm_read_byte(definition + 3);
}

void SpriteFrameNode::draw() {
  sprite->draw(x, y, frame);
}

}
