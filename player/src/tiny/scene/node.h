#pragma once

#include <globals.h>
#include <stdint.h>

class Node: public PlacementNew {

protected:
  const uint8_t *definition;
  uint8_t x;
  uint8_t y;

public:

  Node(const uint8_t *_definition);

  virtual void draw() {};
  virtual ~Node() {};
};

class Sprite;

class SpriteNode: public Node {
protected:
  Sprite *sprite;
public:
  SpriteNode(const uint8_t *_definition);
};

class SpriteFrameNode: public SpriteNode {
  uint8_t frame;
public:
  SpriteFrameNode(const uint8_t *_definition);
  void draw() override;
};

class Loop;

class SpriteLoopNode: public SpriteNode {
  Loop *loop;
  uint8_t index;
public:
  SpriteLoopNode(const uint8_t *_definition);
  void draw() override;
};
