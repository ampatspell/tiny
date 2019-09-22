#include <tiny/scene/layer/pixel.h>

namespace Tiny {

PixelLayer::PixelLayer(const uint8_t *_definition, Node **_nodes, uint8_t _numberOfNodes) :
    Layer(_definition, _nodes, _numberOfNodes) {
}

}
