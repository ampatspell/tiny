#include <frames.h>
#include <Sprites.h>

Frames::Frames(const unsigned char *_frames) :
    frames(_frames) {
}

void Frames::draw(uint8_t x, uint8_t y, uint8_t frame) {
  Sprites::drawPlusMask(x, y, frames, frame);
}
