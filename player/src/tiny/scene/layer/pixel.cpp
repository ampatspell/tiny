#include <tiny/scene/layer/pixel.h>

namespace Tiny {

PixelLayer::PixelLayer(Scene *_scene, const uint8_t *_definition, Node **_nodes, uint8_t _numberOfNodes) :
    Layer(_scene, _definition, _nodes, _numberOfNodes) {
}

}
