#include <layer.h>
#include <scene.h>

Scene::Scene(SceneBackgroundColor _background, Layer **_layers, uint8_t _layersCount) :
    background(_background), layers(_layers), layersCount(_layersCount) {
}

void Scene::draw() {
  for (uint8_t i = 0; i < layersCount; i++) {
    layers[i]->draw();
  }
}
