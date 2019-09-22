#pragma once

#include <stdint.h>
#include <tiny/scene/node/sprite/sprite.h>

namespace Tiny {

class SpriteFrameNode: public SpriteNode {
  uint8_t frame;
public:
  SpriteFrameNode(const uint8_t *_definition);
  void draw() override;
};

}
