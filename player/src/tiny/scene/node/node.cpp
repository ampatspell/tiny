#include <avr/pgmspace.h>
#include <tiny/scene/node/node.h>

namespace Tiny {

Node::Node(const uint8_t *_definition) :
    definition(_definition) {
  x = pgm_read_byte(definition);
  y = pgm_read_byte(definition + 1);
}

}
