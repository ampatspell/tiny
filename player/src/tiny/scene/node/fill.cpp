#include <avr/pgmspace.h>
#include <tiny/scene/node/fill.h>

namespace Tiny {

FillNode::FillNode(const Layer *_layer, const uint8_t *_definition) :
    Node(_layer, _definition) {
}

}
