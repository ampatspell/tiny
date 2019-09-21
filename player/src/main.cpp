#include <Arduboy2.h>
#include <Arduboy2Core.h>
#include <generated/scenes.h>
#include <globals.h>
#include <stdint.h>
#include <tiny/scene/scene.h>

Scene *scene = nullptr;
uint8_t idx = 0;
bool info = false;

void setup() {
//  Serial.begin(9600);

  arduboy.begin();
  arduboy.setFrameRate(24);
  if (Tiny::Scenes::getNumberOfScenes() == 0) {
    return;
  }
  scene = Tiny::Scenes::instantiate(0);
}

void loop() {
  if (!(arduboy.nextFrame())) {
    return;
  }

  arduboy.pollButtons();

  if (arduboy.justPressed(UP_BUTTON)) {
    if (idx > 0) {
      idx = idx - 1;
      scene = Tiny::Scenes::instantiate(idx);
    }
  } else if (arduboy.justPressed(DOWN_BUTTON)) {
    if (idx + 1 < Tiny::Scenes::getNumberOfScenes()) {
      idx = idx + 1;
      scene = Tiny::Scenes::instantiate(idx);
    }
  }

  if (arduboy.justPressed(A_BUTTON)) {
    info = true;
  } else if (arduboy.justReleased(A_BUTTON)) {
    info = false;
  }

  if (scene) {
    scene->draw();
  } else {
  }

  arduboy.display(true);
}
