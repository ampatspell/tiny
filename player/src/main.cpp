#include <Arduboy2.h>
#include <generated/scene_01.h>
#include <globals.h>
#include <generated/scenes.h>
#include <tiny/scene/scene.h>

void setup() {
  arduboy.begin();
  arduboy.setFrameRate(24);
}

void loop() {
  if (!(arduboy.nextFrame())) {
    return;
  }
  arduboy.pollButtons();

  arduboy.setCursor(1, 1);

  unsigned long time = millis();
  Tiny::Scene *scene = Tiny::instantiateScene(0);

  unsigned long now = millis();
  unsigned long took = now - time;

  char buffer[30];
  snprintf(buffer, sizeof(buffer), "%p %i %lu\n", scene, scene->inits, took);
  arduboy.println(buffer);

  arduboy.display(true);
}
