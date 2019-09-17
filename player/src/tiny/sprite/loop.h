#pragma once

#include <stdint.h>

class Loop {
  const uint8_t *definition;
public:
  Loop(const uint8_t *_definition);
};
