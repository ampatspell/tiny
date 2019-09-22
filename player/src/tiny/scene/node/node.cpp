#include <avr/pgmspace.h>
#include <tiny/scene/node/node.h>

namespace Tiny {

Node::Node(const Layer *_layer, const uint8_t *_definition) :
    layer(_layer), definition(_definition) {
  x = pgm_read_byte(definition);
  y = pgm_read_byte(definition + 1);
}

}
