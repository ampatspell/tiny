#pragma once

#include <globals.h>
#include <stdint.h>

class Frames: public NonAssignable {

  const unsigned char *frames;

public:

  Frames(const unsigned char *_frames);

  void draw(uint8_t x, uint8_t y, uint8_t frame);

};
