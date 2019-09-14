#include <Arduboy2.h>
#include <generated/sprites.h>
#include <stdint.h>
#include <Sprites.h>
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

  static uint8_t frame = 0;
  if (arduboy.everyXFrames(7)) {
    frame++;
    if (frame > 3) {
      frame = 0;
    }
  }

  Sprites::drawPlusMask(10, 10, sprite_weirdo_frames_plus_mask, frame);
  Sprites::drawPlusMask(30, 13, sprite_bubble_frames_plus_mask, frame);

  arduboy.display();
}
