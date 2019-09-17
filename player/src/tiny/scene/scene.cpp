#include <tiny/scene/scene.h>
#include <tiny/scene/layer.h>

void Scene::addLayer(Layer *_layer) {
  if(!layer) {
    layer = _layer;
  } else {
    // TODO: sets 1st and last layer. doh
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
