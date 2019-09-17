#pragma once

#include <globals.h>
#include <stdint.h>

class Loop;

class Sprite: public PlacementNew {

  const unsigned char *definition;
  Loop **loops;
  uint8_t numberOfLoops;

public:

  Sprite(const unsigned char *_definition, Loop **_loops);
  void addLoop(Loop *loop);

  void draw(uint8_t x, uint8_t y, uint8_t frame);
  Loop *getLoop(uint8_t index);

};
