#pragma once

#include <stdint.h>
#include <tiny/scene/layer/layer.h>

namespace Tiny {

class GridLayer: public Layer {

public:
  GridLayer(const Scene *_scene, const uint8_t *_definition, Node **_nodes, uint8_t _numberOfNodes);

};

}
