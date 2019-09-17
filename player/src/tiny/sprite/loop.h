#pragma once

#include <globals.h>
#include <stdint.h>

class Sprite;

class Loop: public PlacementNew {

  const uint8_t *definition;
  Sprite *sprite;

public:
  Loop(const uint8_t *_definition, Sprite *sprite);

  uint8_t next(uint8_t index);
  void draw(uint8_t x, uint8_t y, uint8_t index);

};
