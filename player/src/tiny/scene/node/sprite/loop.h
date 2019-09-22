#pragma once

#include <stdint.h>
#include <tiny/scene/node/sprite/sprite.h>

namespace Tiny {

class Loop;

class SpriteLoopNode: public SpriteNode {
  Loop *loop;
  uint8_t index;
public:
  SpriteLoopNode(const uint8_t *_definition);
  void draw() override;
};

}
