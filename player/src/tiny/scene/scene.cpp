#include <tiny/scene/scene.h>
#include <tiny/scene/layer.h>

Scene::Scene(const uint8_t *_definition): definition(_definition), first(nullptr), last(nullptr)  {
}

void Scene::addLayer(Layer *_layer) {
  if(!first) {
    first = _layer;
    last = _layer;
  } else {
    last->setNext(_layer);
    last = _layer;
  }
}

void Scene::draw() {
  Layer *curr = first;
  while(curr) {
    curr->draw();
    curr = curr->getNext();
  }
}
