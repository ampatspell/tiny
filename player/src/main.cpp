#include <Arduboy2.h>
#include <globals.h>
#include <generated/scenes.h>
#include <tiny/scene/scene.h>

Scene *scene;

void setup() {
  arduboy.begin();
  arduboy.setFrameRate(24);
  scene = Tiny::Scenes::instantiate(0);
}

void loop() {
  if (!(arduboy.nextFrame())) {
    return;
  }

  arduboy.pollButtons();
  scene->draw();

  Tiny::snprintf(0, 0, 20, "scenes=%u", Tiny::Scenes::getStorageSize());

  arduboy.display(true);
}
