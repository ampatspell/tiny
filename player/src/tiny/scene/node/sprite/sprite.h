#pragma once

#include <stdint.h>
#include <tiny/scene/node/node.h>

namespace Tiny {

class Sprite;

class SpriteNode: public Node {
protected:
  Sprite *sprite;
public:
  SpriteNode(const uint8_t *_definition);
};

}
