#pragma once

#include <globals.h>
#include <stdint.h>

class Loop;

class Sprite: public PlacementNew {

  const unsigned char *definition;
  Loop **loops;

public:

  Sprite(const unsigned char *_definition, Loop **_loops);

  Loop *loopAtIndex(uint8_t index);

  void draw(uint8_t x, uint8_t y, uint8_t frame);

};
