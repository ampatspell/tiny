#include <avr/pgmspace.h>
#include <Arduboy2.h>
#include <generated/sprites.h>
#include <tiny/scene/node.h>
#include <tiny/sprite/loop.h>
#include <tiny/sprite/sprite.h>

Node::Node(const uint8_t *_definition): definition(_definition) {
  x = pgm_read_byte(definition);
  y = pgm_read_byte(definition + 1);
}

SpriteNode::SpriteNode(const uint8_t *_definition): Node(_definition) {
  uint8_t index = pgm_read_byte(definition + 2);
  sprite = Tiny::Sprites::getSprite(index);
}

SpriteFrameNode::SpriteFrameNode(const uint8_t *_definition): SpriteNode(_definition) {
  frame = pgm_read_byte(definition + 3);
}

void SpriteFrameNode::draw() {
  sprite->draw(x, y, frame);
}

SpriteLoopNode::SpriteLoopNode(const uint8_t *_definition): SpriteNode(_definition), index(0) {
  uint8_t index = pgm_read_byte(definition + 3);
  loop = sprite->getLoop(index);
}

void SpriteLoopNode::draw() {
  if(arduboy.everyXFrames(7)) {
    index = loop->next(index);
  }
  loop->draw(x, y, index);
}
