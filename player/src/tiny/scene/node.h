#pragma once

#include <stdint.h>
#include <avr/pgmspace.h>

class Node {

protected:
  const uint8_t *definition;

private:
  Node *next;

public:

  Node(const uint8_t *_definition): definition(_definition), next(nullptr) {}

  void setNext(Node *node);

};

class Sprite;

class SpriteNode: public Node {
  Sprite *sprite;
public:
  SpriteNode(const uint8_t *_definition): Node(_definition) {
    // uint8_t index = pgm_read_byte(definition);
  }
};

class SpriteFrameNode: public SpriteNode {
  uint8_t frame;
public:
  SpriteFrameNode(const uint8_t *_definition): SpriteNode(_definition) {}
};

class Loop;

class SpriteLoopNode: public SpriteNode {
  Loop *loop;
  uint8_t index;
public:
  SpriteLoopNode(const uint8_t *_definition): SpriteNode(_definition) {}
};
