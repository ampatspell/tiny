#include <tiny/scene/scene.h>
#include <tiny/scene/layer.h>

void Scene::addLayer(Layer *_layer) {
  if(!layer) {
    layer = _layer;
  } else {
    layer->setNext(_layer);
  }
}

void Scene::draw() {
  Layer *curr = layer;
  while(curr) {
    curr->draw();
    curr = curr->getNext();
  }
}
