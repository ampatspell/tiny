#include <tiny/scene/layer.h>
#include <tiny/scene/scene.h>

Scene::Scene(const uint8_t *_definition, Layer **_layers): definition(_definition), layers(_layers), numberOfLayers(0)  {
}

void Scene::addLayer(Layer *_layer) {
  layers[numberOfLayers] = _layer;
  numberOfLayers++;
}

void Scene::draw() {
  for(uint8_t i = 0; i < numberOfLayers; i++) {
    Layer *layer = layers[i];
    layer->draw();
  }
}
