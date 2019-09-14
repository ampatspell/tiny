#include <sprite.h>
#include <Sprites.h>

void Sprite::draw(uint8_t x, uint8_t y, uint8_t frame) {
  Sprites::drawPlusMask(x, y, frames, frame);
}
