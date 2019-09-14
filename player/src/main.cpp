#include <Arduboy2.h>
#include <generated/sprites.h>
#include <loop.h>
#include <stdint.h>
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

  arduboy.fillScreen();
  arduboy.setCursor(4, 9);
  arduboy.print(F("Weird animals"));

  static uint8_t wink = 0;
  static uint8_t loop = 0;
  static uint8_t building = 0;
  if (arduboy.everyXFrames(7)) {
    wink = Generated::weirdo_wink.next(wink);
    loop = Generated::bubble_in.next(loop);
    building = Generated::building_flashing.next(building);
  }

  Generated::weirdo_wink.draw(20, 24, wink);
  Generated::building_flashing.draw(40, 15, building);
  Generated::bubble_in.draw(27, 13, loop);

  arduboy.display();
}
