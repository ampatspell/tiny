#include <Sprites.h>
#include <tiny/sprite/sprite.h>

Sprite::Sprite(const unsigned char *_definition, Loop **_loops): definition(_definition), loops(_loops), numberOfLoops(0) {
}

void Sprite::addLoop(Loop *loop) {
  loops[numberOfLoops] = loop;
  numberOfLoops++;
}

Loop* Sprite::getLoop(uint8_t index) {
  return loops[index];
}

void Sprite::draw(uint8_t x, uint8_t y, uint8_t frame) {
  Sprites::drawPlusMask(x, y, definition, frame);
}
