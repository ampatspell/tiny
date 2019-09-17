#pragma once

#include <stdint.h>

class Loop;

class Sprite {
  const unsigned char *definition;
  Loop **loops;
public:
  Sprite(const unsigned char *_definition, Loop **_loops);
  void draw(uint8_t x, uint8_t y, uint8_t frame);
  Loop *getLoop(uint8_t index);
};
