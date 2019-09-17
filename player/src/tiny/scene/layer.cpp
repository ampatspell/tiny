#include <tiny/scene/layer.h>
#include <tiny/scene/node.h>

Layer::Layer(const uint8_t *_definition, Node **_nodes): definition(_definition), nodes(_nodes), numberOfNodes(0) {
}

void Layer::addNode(Node *_node) {
  nodes[numberOfNodes] = _node;
  numberOfNodes++;
}

void Layer::draw() {
  for(uint8_t i = 0; i < numberOfNodes; i++) {
    Node *node = nodes[i];
    node->draw();
  }
}
