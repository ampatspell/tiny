#pragma once

#include <globals.h>
#include <stdint.h>

namespace Tiny {

class Layer;

class Scene: public PlacementNew {

  const uint8_t *definition;

  Layer **layers;
  uint8_t numberOfLayers;

public:

  Scene(const uint8_t *_definition, Layer **layers, uint8_t _numberOfLayers);

  uint8_t index();

  void draw();

};

}
