#pragma once

#include <stdint.h>
#include <tiny/scene/layer/layer.h>

namespace Tiny {

class PixelLayer: public Layer {

public:
  PixelLayer(const uint8_t *_definition, Node **_nodes, uint8_t _numberOfNodes);

};

}
