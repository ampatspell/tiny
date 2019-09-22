#pragma once

#include <globals.h>
#include <stdint.h>

class Node;

class Layer: public PlacementNew {

  const uint8_t *definition;

  Node **nodes;
  uint8_t numberOfNodes;

public:

  Layer(const uint8_t *_definition, Node **_nodes, uint8_t _numberOfNodes);

  virtual void draw();

  virtual ~Layer() {
  }

};

class GridLayer: public Layer {
public:
  GridLayer(const uint8_t *_definition, Node **_nodes, uint8_t _numberOfNodes) :
      Layer(_definition, _nodes, _numberOfNodes) {
  }
};

class PixelLayer: public Layer {
public:
  PixelLayer(const uint8_t *_definition, Node **_nodes, uint8_t _numberOfNodes) :
      Layer(_definition, _nodes, _numberOfNodes) {
  }
};
