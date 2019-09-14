#include <frames.h>
#include <loop.h>

Loop::Loop(Frames *_frames, const uint8_t *_indexes, uint8_t _length) :
    frames(_frames), indexes(_indexes), length(_length) {
}

uint8_t Loop::nextIndex(uint8_t current) {
  uint8_t next = current + 1;
  if (next >= length) {
    return 0;
  }
  return next;
}

uint8_t Loop::frameForIndex(uint8_t index) {
  return indexes[index];
}

void Loop::draw(uint8_t x, uint8_t y, uint8_t index) {
  uint8_t frame = frameForIndex(index);
  frames->draw(x, y, frame);
}
