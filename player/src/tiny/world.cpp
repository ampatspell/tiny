#include <tiny/world.h>

namespace Tiny {

World::World() {
  scenes.switchToSceneAtIndex(0);
}

void World::nextScene() {
  scenes.switchToSceneAtIndexDelta(+1);
}

void World::previousScene() {
  scenes.switchToSceneAtIndexDelta(-1);
}

void World::draw() {
  scenes.draw();
}

}
