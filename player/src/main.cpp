#include <Arduboy2.h>
#include <Sprites.h>
#include <WString.h>

Arduboy2 arduboy;
Sprites sprites;

void setup() {
  arduboy.begin();
  arduboy.setFrameRate(24);
}

void loop() {
  if (!(arduboy.nextFrame())) {
    return;
  }
  arduboy.clear();
  arduboy.setCursor(4, 9);
  arduboy.print(F("Weird animals"));
  arduboy.display();
}
