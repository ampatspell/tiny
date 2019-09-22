#pragma once

#include <globals.h>
#include <stdint.h>

namespace Tiny {

class Layer;

class Node: public PlacementNew {

protected:
  Layer *layer;
  const uint8_t *definition;
  uint8_t x;
  uint8_t y;

public:

  Node(Layer *_layer, const uint8_t *_definition);

  virtual void draw() {
  }

  virtual ~Node() {
  }
};

}
