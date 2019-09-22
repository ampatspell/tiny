#include <tiny/scene/layer/layer.h>
#include <tiny/scene/node/node.h>

namespace Tiny {

Layer::Layer(Scene *_scene, const uint8_t *_definition, Node **_nodes, uint8_t _numberOfNodes) :
    scene(_scene), definition(_definition), nodes(_nodes), numberOfNodes(_numberOfNodes) {
}

void Layer::draw() {
  for (uint8_t i = 0; i < numberOfNodes; i++) {
    Node *node = nodes[i];
    node->draw();
  }
}

}
