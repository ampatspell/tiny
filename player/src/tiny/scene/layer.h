#pragma once

#include <globals.h>
#include <stdint.h>

class Node;

class Layer: public PlacementNew {

  const uint8_t *definition;

  Node **nodes;
  uint8_t numberOfNodes;

public:

  Layer(const uint8_t *_definition, Node **_nodes);
  void addNode(Node *node);

  virtual void draw();
  virtual ~Layer() {};

};

class GridLayer: public Layer {
public:
  GridLayer(const uint8_t *_definition, Node **_nodes): Layer(_definition, _nodes) {}
};

class PixelLayer: public Layer {
public:
  PixelLayer(const uint8_t *_definition, Node **_nodes): Layer(_definition, _nodes) {}
};
