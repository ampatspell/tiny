#pragma once

#include <avr/pgmspace.h>
#include <globals.h>
#include <stddef.h>
#include <stdint.h>

namespace Test {

enum SceneBackground {
  Black, White, Transparent
};

struct SceneDefinition {
  uint8_t width;
  uint8_t height;
  SceneBackground background;
};

struct LayerDefinition {
};

struct NodeDefinition {
  uint8_t x;
  uint8_t y;
  uint8_t sprite;
  uint8_t loop;
};

//

constexpr SceneDefinition scene01 PROGMEM = { .width = 128, .height = 64, .background = Black };
constexpr LayerDefinition layer01 PROGMEM = { };
constexpr NodeDefinition node01 = { .x = 10, .y = 10, .sprite = 1, .loop = 5 };

// --

class Layer;

class Scene: public PlacementNew {
  const SceneDefinition *definition;
  Layer **layers;
  uint8_t numberOfLayers;
public:
  Scene(const SceneDefinition *_definition, Layer **_layers, uint8_t _numberOfLayers) :
      definition(_definition), layers(_layers), numberOfLayers(_numberOfLayers) {
  }
};

class Layer: public PlacementNew {
  const LayerDefinition *definition;
public:
  Layer(const LayerDefinition *_definition) :
      definition(_definition) {
  }
};

class Node: public PlacementNew {
  const NodeDefinition *definition;
public:
  Node(const NodeDefinition *_definition) :
      definition(_definition) {
  }
};

union MaxSceneSize {
  size_t scene01 = sizeof(Scene) + sizeof(Layer) + sizeof(Node);
  // size_t scene02 = ...
  // size_t scene03 = ...
};

// one scene at the time
uint8_t storage[sizeof(MaxSceneSize)];

void instantiate() {
  uint8_t *ptr = storage;

  Layer **layers = reinterpret_cast<Layer**>(ptr);
  uint8_t numberOfLayers = 1;
  ptr += sizeof(Layer) * numberOfLayers;

  Scene *scene = new (ptr) Scene(&scene01, layers, numberOfLayers);
  ptr += sizeof(Scene);

  // Node **nodes = ...
  Layer *layer = new (ptr) Layer(&layer01);
  layers[0] = layer;
  ptr += sizeof(Layer);

  Node *node = new (ptr) Node(&node01);
  // nodes[0] = node;
  ptr += sizeof(Node);
}

}
