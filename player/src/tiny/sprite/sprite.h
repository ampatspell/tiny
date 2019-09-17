#pragma once

namespace Tiny {

class Loop;

class Sprite {
  const unsigned char *definition;
  Loop *loops;
public:
  Sprite(const unsigned char *_definition, Loop *_loops);

};

}
