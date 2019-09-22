#include <Arduboy2.h>
#include <Arduboy2Core.h>
#include <globals.h>
#include <tiny/world.h>

bool info = false;

Tiny::World world;

void setup() {
//  Serial.begin(9600);

  arduboy.begin();
  arduboy.setFrameRate(24);
}

void loop() {
  if (!(arduboy.nextFrame())) {
    return;
  }

  arduboy.pollButtons();

  if (arduboy.justPressed(UP_BUTTON)) {
    world.previousScene();
  } else if (arduboy.justPressed(DOWN_BUTTON)) {
    world.nextScene();
  }

  world.draw();

  arduboy.display(true);
}
