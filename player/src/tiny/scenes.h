#pragma once

#include <globals.h>
#include <stdint.h>

namespace Tiny {

class Scene;

class Scenes: public NonAssignable {
  Scene *scene;
public:
  Scenes();

  uint8_t numberOfScenes();

  bool switchToSceneAtIndex(uint8_t index);
  bool switchToSceneAtIndexDelta(int8_t delta);

  void draw();

};

}
