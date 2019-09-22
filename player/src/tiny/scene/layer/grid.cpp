#include <tiny/scene/layer/grid.h>

namespace Tiny {

GridLayer::GridLayer(const uint8_t *_definition, Node **_nodes, uint8_t _numberOfNodes) :
    Layer(_definition, _nodes, _numberOfNodes) {
}

}
