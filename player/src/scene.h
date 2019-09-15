#pragma once

#include <globals.h>
#include <stdint.h>

class Layer;

enum SceneBackgroundColor {
  Black, White, Transparent
};

class Scene: public NonAssignable {

  SceneBackgroundColor background;
  Layer **layers;
  uint8_t layersCount;

public:

  Scene(SceneBackgroundColor _background, Layer **_layers, uint8_t _layersCount);

  void draw();

};
