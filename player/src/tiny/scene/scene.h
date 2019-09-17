#pragma once

#include <stdint.h>

namespace Tiny {

class Scene {
public:
  uint8_t inits;
  Scene(uint8_t _inits): inits(_inits) {}
  void hello() {}
};

}
