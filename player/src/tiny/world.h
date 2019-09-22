#pragma once

#include <tiny/scenes.h>

namespace Tiny {

class World: public NonAssignable {

  Scenes scenes;

public:

  World();

  void nextScene();
  void previousScene();

  void draw();

};

}
