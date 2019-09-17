#include <tiny/scene/layer.h>
#include <tiny/scene/node.h>

void Layer::setNext(Layer *layer) {
  next = layer;
}

void Layer::addNode(Node *_node) {
  if(!node) {
    node = _node;
  } else {
    node->setNext(_node);
  }
}
