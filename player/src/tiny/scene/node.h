#pragma once

#include <stdint.h>
#include <avr/pgmspace.h>

class Node {

protected:
  const uint8_t *definition;
  uint8_t x;
  uint8_t y;

private:
  Node *next;

public:

  Node(const uint8_t *_definition);
  void setNext(Node *node);
  Node *getNext();

  virtual void draw() {};

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
  SpriteLoopNode(const uint8_t *_definition): SpriteNode(_definition) {}
  void draw() override;
};
