#pragma once

namespace Tiny {

class Node {
public:
  Node() {}
};

class SpriteNode: public Node {
public:
  SpriteNode(): Node() {}
};

class SpriteFrameNode: public SpriteNode {
public:
  SpriteFrameNode(): SpriteNode() {}
};

class SpriteLoopNode: public SpriteNode {
public:
  SpriteLoopNode(): SpriteNode() {}
};

}
