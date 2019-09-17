#pragma once

#include <stdint.h>

class Node;

class Layer {
  const uint8_t *definition;
public:
  Layer(const uint8_t *_definition): definition(_definition) {}
  void registerNode(Node *node) {}
};

class GridLayer: public Layer {
public:
  GridLayer(const uint8_t *_definition): Layer(_definition) {}
};

class PixelLayer: public Layer {
public:
  PixelLayer(const uint8_t *_definition): Layer(_definition) {}
};
