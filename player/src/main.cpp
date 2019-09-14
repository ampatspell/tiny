#include <Arduboy2.h>
#include <generated/sprite.h>
#include <WString.h>

Arduboy2 arduboy;

void setup() {
  arduboy.begin();
  arduboy.setFrameRate(24);
}

void loop() {
  if (!(arduboy.nextFrame())) {
    return;
  }
  arduboy.clear();
  arduboy.fillScreen();
  arduboy.setCursor(4, 9);
  arduboy.print(F("Weird animals"));
  drawSprite(10, 10);
  arduboy.display();
}
