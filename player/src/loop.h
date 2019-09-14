#pragma once

#include <globals.h>
#include <stdint.h>

class Frames;

class Loop: public NonAssignable {

  Frames *frames;
  const uint8_t *indexes;
  uint8_t length;

public:

  Loop(Frames *_frames, const uint8_t *_indexes, uint8_t _length);

  uint8_t nextIndex(uint8_t current);
  uint8_t frameForIndex(uint8_t index);

  void draw(uint8_t x, uint8_t y, uint8_t index);

};
