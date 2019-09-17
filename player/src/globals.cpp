#include <globals.h>
#include <stdarg.h>
#include <stdint.h>
#include <stdio.h>

Arduboy2 arduboy;

namespace Tiny {


void snprintf(uint8_t x, uint8_t y, uint8_t max, const char *fmt...) {
  char buffer[max];

  va_list args;
  va_start(args, fmt);
  vsnprintf(buffer, sizeof(buffer), fmt, args);
  va_end(args);

  arduboy.setCursor(x, y);
  arduboy.println(buffer);
}

}
