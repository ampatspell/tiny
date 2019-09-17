#include "sprite.h"
#include <sprites.h>

Sprite::Sprite(const unsigned char *_definition, Loop **_loops): definition(_definition), loops(_loops) {
}

Loop* Sprite::getLoop(uint8_t index) {
  return loops[index];
}

void Sprite::draw(uint8_t x, uint8_t y, uint8_t frame) {
  Sprites::drawPlusMask(x, y, definition, frame);
}
