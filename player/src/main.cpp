#include <Arduboy2.h>
#include <globals.h>
#include <generated/scenes.h>
#include <tiny/scene/scene.h>

Scene *scene;
uint8_t idx;

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

  if(arduboy.everyXFrames(48)) {
    idx = idx == 0 ? 1 : 0;
    scene = Tiny::Scenes::instantiate(idx);
  }

  scene->draw();

 Tiny::snprintf(0, 0, 20, "scene:%u", idx);

  arduboy.display(true);
}
