#pragma once

#include <stdint.h>

class Sprite {
  const uint8_t *frames;

public:

  Sprite(const uint8_t *_frames) :
      frames(_frames) {
  }

  void draw(uint8_t x, uint8_t y, uint8_t frame);

};
