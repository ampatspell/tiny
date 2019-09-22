#pragma once

#include <globals.h>
#include <stdint.h>

namespace Tiny {

class Node: public PlacementNew {

protected:
  const uint8_t *definition;
  uint8_t x;
  uint8_t y;

public:

  Node(const uint8_t *_definition);

  virtual void draw() {
  }

  virtual ~Node() {
  }
};

}
