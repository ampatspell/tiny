#pragma once

#include <stdint.h>

class Node;

class Layer {

  const uint8_t *definition;
  Layer *next;
  Node *node;

public:

  Layer(const uint8_t *_definition): definition(_definition), next(nullptr), node(nullptr) {}

  void setNext(Layer *layer);
  void addNode(Node *node);

};

class GridLayer: public Layer {
public:
  GridLayer(const uint8_t *_definition): Layer(_definition) {}
};

class PixelLayer: public Layer {
public:
  PixelLayer(const uint8_t *_definition): Layer(_definition) {}
};
