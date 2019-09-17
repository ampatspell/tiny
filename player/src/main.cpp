#include <Arduboy2.h>
#include <globals.h>
#include <generated/scenes.h>
#include <generated/sprites.h>
#include <tiny/scene/scene.h>
#include <tiny/sprite/sprite.h>

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

  arduboy.setCursor(1, 1);

  unsigned long time = millis();
  scene->draw();
  unsigned long now = millis();
  unsigned long took = now - time;

  char buffer[30];
  snprintf(buffer, sizeof(buffer), "Took %lu\n", took);
  arduboy.println(buffer);

  arduboy.display(true);
}
