#include <Arduboy2.h>
#include <generated/sprites.h>
#include <globals.h>
#include <loop.h>
#include <sprite.h>
#include <stdint.h>
#include <WString.h>

void setup() {
  arduboy.begin();
  arduboy.setFrameRate(24);
}

void loop() {
  if (!(arduboy.nextFrame())) {
    return;
  }

  arduboy.setCursor(4, 9);
  arduboy.print(F("Weird animals"));

  static uint8_t wink = 0;
  static uint8_t bubble = 0;
  static uint8_t building = 0;

  Loop *winkLoop = Generated::Sprites::weirdo.loopAtIndex(0);
  Loop *bubbleLoop = Generated::Sprites::bubble.loopAtIndex(0);
  Loop *buildingLoop = Generated::Sprites::building.loopAtIndex(0);

  if (arduboy.everyXFrames(7)) {
    wink = winkLoop->nextIndex(wink);
    bubble = bubbleLoop->nextIndex(bubble);
    building = buildingLoop->nextIndex(building);
  }

  winkLoop->draw(20, 24, wink);
  buildingLoop->draw(40, 15, building);
  bubbleLoop->draw(27, 13, bubble);

  arduboy.display(true);
}
