#include <tiny/scene/layer.h>
#include <tiny/scene/node.h>

void Layer::setNext(Layer *layer) {
  next = layer;
}

Layer *Layer::getNext() {
  return next;
}

void Layer::addNode(Node *_node) {
  if(!node) {
    node = _node;
  } else {
    node->setNext(_node);
  }
}

void Layer::draw() {
  Node *curr = node;
  while(curr) {
    node->draw();
    curr = curr->getNext();
  }
}
