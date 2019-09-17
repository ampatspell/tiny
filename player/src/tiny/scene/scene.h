#pragma once

#include <stdint.h>

class Layer;

class Scene {

  const uint8_t *definition;

  Layer *first;
  Layer *last;

public:

  Scene(const uint8_t *_definition);
  void addLayer(Layer *_layer);

  void draw();

};
