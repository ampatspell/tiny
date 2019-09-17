#pragma once

#include <stdint.h>

class Node {

  const uint8_t *definition;
  Node *next;

public:

  Node(const uint8_t *_definition): definition(_definition), next(nullptr) {}

  void setNext(Node *node);

};

class SpriteNode: public Node {
public:
  SpriteNode(const uint8_t *_definition): Node(_definition) {}
};

class SpriteFrameNode: public SpriteNode {
public:
  SpriteFrameNode(const uint8_t *_definition): SpriteNode(_definition) {}
};

class SpriteLoopNode: public SpriteNode {
public:
  SpriteLoopNode(const uint8_t *_definition): SpriteNode(_definition) {}
};
