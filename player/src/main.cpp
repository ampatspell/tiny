#include <Arduboy2.h>
#include <globals.h>

void setup() {
  arduboy.begin();
  arduboy.setFrameRate(24);
}

void loop() {
  if (!(arduboy.nextFrame())) {
    return;
  }

  arduboy.setCursor(1, 1);
  arduboy.print(F("Hello"));

  arduboy.display(true);
}
