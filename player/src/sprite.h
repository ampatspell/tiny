#pragma once

#include <globals.h>
#include <stdint.h>

class Loop;
class Frames;

class Sprite: public NonAssignable {

  Frames *frames;
  Loop *loops;

public:

  Sprite(Frames *_frames, Loop *_loops);

  Loop* loopAtIndex(uint8_t index);

  void draw(uint8_t x, uint8_t y, uint8_t frame);

};
