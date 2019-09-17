#pragma once

#include <stdint.h>

class Node {
  const uint8_t *definition;
public:
  Node(const uint8_t *_definition): definition(_definition) {}
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
