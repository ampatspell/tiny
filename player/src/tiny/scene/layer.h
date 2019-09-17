#pragma once

#include <stdint.h>

class Node;

class Layer {

  const uint8_t *definition;
  Layer *next;
  Node *node;

public:

  Layer(const uint8_t *_definition): definition(_definition), next(nullptr), node(nullptr) {}
  void addNode(Node *node);

  void setNext(Layer *layer);
  Layer *getNext();

  virtual void draw();

};

class GridLayer: public Layer {
public:
  GridLayer(const uint8_t *_definition): Layer(_definition) {}
};

class PixelLayer: public Layer {
public:
  PixelLayer(const uint8_t *_definition): Layer(_definition) {}
};
