#pragma once

#include <stdint.h>

class Layer;

class Scene {

  const uint8_t *definition;
  Layer *layer;

public:

  Scene(const uint8_t *_definition): definition(_definition), layer(nullptr)  {}
  void addLayer(Layer *_layer);

  void draw();

};
