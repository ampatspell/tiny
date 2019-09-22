#include <generated/scenes.h>
#include <tiny/scene/scene.h>
#include <tiny/scenes.h>

namespace Tiny {

Scenes::Scenes() :
    scene(nullptr) {
}

uint8_t Scenes::numberOfScenes() {
  return Project::Scenes::numberOfScenes();
}

bool Scenes::switchToSceneAtIndex(uint8_t index) {
  if (index + 1 > numberOfScenes()) {
    return false;
  }
  scene = Project::Scenes::instantiateSceneAtIndex(index);
  return true;
}

bool Scenes::switchToSceneAtIndexDelta(int8_t delta) {
  if (!scene) {
    return false;
  }
  int8_t index = scene->index() + delta;
  if (index < 0) {
    return false;
  }
  if (index + 1 > numberOfScenes()) {
    return false;
  }
  return switchToSceneAtIndex(index);
}

void Scenes::draw() {
  if (!scene) {
    return;
  }
  scene->draw();
}

}
