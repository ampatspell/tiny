#include <avr/pgmspace.h>
#include <generated/sprites.h>
#include <tiny/scene/node/sprite/sprite.h>

namespace Tiny {

SpriteNode::SpriteNode(const uint8_t *_definition) :
    Node(_definition) {
  uint8_t index = pgm_read_byte(definition + 2);
  sprite = Tiny::Project::Sprites::spriteAtIndex(index);
}

}
