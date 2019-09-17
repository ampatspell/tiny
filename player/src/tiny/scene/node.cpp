#include <tiny/scene/node.h>
#include <generated/sprites.h>
#include <tiny/sprite/sprite.h>
#include <Arduino.h>

void Node::setNext(Node *node) {
  next = node;
}

Node * Node::getNext() {
  return next;
}

SpriteNode::SpriteNode(const uint8_t *_definition): Node(_definition) {
  uint8_t index = pgm_read_byte(definition);
  sprite = Tiny::Sprites::getSprite(index);
}

void SpriteNode::draw() {
  sprite->draw(random(1, 120), random(1, 60), 0);
}
