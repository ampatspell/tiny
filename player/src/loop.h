#pragma once

#include <sprite.h>
#include <stdint.h>

class Loop {

  Sprite &sprite;
  const uint8_t *indexes;
  uint8_t length;

public:

  Loop(Sprite &_sprite, const uint8_t *_indexes, uint8_t _length) :
      sprite(_sprite), indexes(_indexes), length(_length) {
  }

  void draw(uint8_t x, uint8_t y, uint8_t index);
  uint8_t next(uint8_t current);

};
