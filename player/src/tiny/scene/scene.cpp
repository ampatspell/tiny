#include <avr/pgmspace.h>
#include <Arduboy2.h>
#include <tiny/scene/layer.h>
#include <tiny/scene/scene.h>

Scene::Scene(const uint8_t *_definition, Layer **_layers, uint8_t _numberOfLayers) :
    definition(_definition), layers(_layers), numberOfLayers(_numberOfLayers) {
}

void Scene::draw() {
  uint8_t background = pgm_read_byte(definition + 2);
  if (background == 2) {
    arduboy.fillScreen(WHITE);
  }

  for (uint8_t i = 0; i < numberOfLayers; i++) {
    Layer *layer = layers[i];
    layer->draw();
  }
}
