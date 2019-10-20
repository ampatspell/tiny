#pragma once

#include <stdint.h>
#include <tiny/scene/node/node.h>

namespace Tiny {

class FillNode: public Node {
public:
  FillNode(const Layer *_layer, const uint8_t *_definition);
};

}
