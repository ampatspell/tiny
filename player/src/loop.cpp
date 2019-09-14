#include <loop.h>

void Loop::draw(uint8_t x, uint8_t y, uint8_t index) {
  uint8_t frame = indexes[index];
  sprite.draw(x, y, frame);
}

uint8_t Loop::next(uint8_t current) {
  uint8_t next = current + 1;
  if (next + 1 > length) {
    return 0;
  }
  return next;
}
