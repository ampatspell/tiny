#include <frames.h>
#include <sprite.h>
#include <loop.h>

Sprite::Sprite(Frames *_frames, Loop *_loops) :
    frames(_frames), loops(_loops) {
}

Loop* Sprite::loopAtIndex(uint8_t index) {
  Loop *loop = &loops[index];
  return loop;
}

void Sprite::draw(uint8_t x, uint8_t y, uint8_t frame) {
  frames->draw(x, y, frame);
}
