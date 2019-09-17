#include <tiny/scene/layer.h>
#include <tiny/scene/node.h>

Layer::Layer(const uint8_t *_definition): definition(_definition), next(nullptr), last(nullptr), first(nullptr) {
}

void Layer::setNext(Layer *layer) {
  next = layer;
}

Layer *Layer::getNext() {
  return next;
}

void Layer::addNode(Node *_node) {
  if(!first) {
    first = _node;
    last = _node;
  } else {
    last->setNext(_node);
    last = _node;
  }
}

void Layer::draw() {
  Node *curr = first;
  while(curr) {
    curr->draw();
    curr = curr->getNext();
  }
}
