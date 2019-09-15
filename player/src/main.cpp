#include <Arduboy2.h>
#include <generated/scene_01.h>
#include <globals.h>
#include <scene.h>

void setup() {
  arduboy.begin();
  arduboy.setFrameRate(24);
}

void loop() {
  if (!(arduboy.nextFrame())) {
    return;
  }

  Generated::Scenes::scene_01.draw();

  arduboy.display(true);
}
