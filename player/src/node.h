#pragma once

#include <globals.h>
#include <stdint.h>

class Loop;

class Sprite;

struct NodePosition {

  uint8_t x;
  uint8_t y;

  NodePosition(uint8_t _x, uint8_t _y);

};

class Node: public NonAssignable {

protected:

  NodePosition position;

public:

  Node(NodePosition _position);

  virtual void draw() {
  }

  virtual ~Node() {
  }

};

class SpriteNode: public Node {

protected:

  Sprite *sprite;

public:

  SpriteNode(NodePosition _position, Sprite *_sprite);

};

class SpriteFrameNode: public SpriteNode {

  uint8_t frame;

public:

  SpriteFrameNode(NodePosition _position, Sprite *_sprite, uint8_t _frame);

  void draw() override;

};

class SpriteLoopNode: public SpriteNode {

  uint8_t index = 0;
  Loop *loop;

public:

  SpriteLoopNode(NodePosition _position, Sprite *_sprite, uint8_t _loop);

  void draw() override;

};
