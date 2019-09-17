#pragma once

#include <stdint.h>

class Layer;

class Scene {
  const uint8_t *definition;
public:
  Scene(const uint8_t *_definition): definition(_definition)  {}
  void registerLayer(Layer *layer) {}
};
