#include <avr/pgmspace.h>
#include <tiny/sprite/loop.h>
#include <tiny/sprite/sprite.h>

namespace Tiny {

Loop::Loop(const uint8_t *_definition, Sprite *_sprite) :
    definition(_definition), sprite(_sprite) {
}

uint8_t Loop::next(uint8_t index) {
  uint8_t total = pgm_read_byte(definition);
  if (index + 1 < total) {
    return index + 1;
  }
  return 0;
}

void Loop::draw(uint8_t x, uint8_t y, uint8_t index) {
  uint8_t frame = pgm_read_byte(definition + sizeof(uint8_t) + index);
  sprite->draw(x, y, frame);
}

}
