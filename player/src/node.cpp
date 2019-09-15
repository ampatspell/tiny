#include <Arduboy2.h>
#include <loop.h>
#include <node.h>
#include <sprite.h>

NodePosition::NodePosition(uint8_t _x, uint8_t _y) :
    x(_x), y(_y) {
}

Node::Node(NodePosition _position) :
    position(_position) {
}

SpriteNode::SpriteNode(NodePosition _position, Sprite *_sprite) :
    Node(_position), sprite(_sprite) {
}

SpriteFrameNode::SpriteFrameNode(NodePosition _position, Sprite *_sprite, uint8_t _frame) :
    SpriteNode(_position, _sprite), frame(_frame) {
}

void SpriteFrameNode::draw() {
  sprite->draw(position.x, position.y, frame);
}

SpriteLoopNode::SpriteLoopNode(NodePosition _position, Sprite *_sprite, uint8_t _loop) :
    SpriteNode(_position, _sprite), loop(_sprite->loopAtIndex(_loop)) {
}

void SpriteLoopNode::draw() {
  if (arduboy.everyXFrames(7)) {
    index = loop->nextIndex(index);
  }
  loop->draw(position.x, position.y, index);
}
