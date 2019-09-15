#include <layer.h>
#include <node.h>

Grid::Grid(uint8_t _width, uint8_t _height) :
    width(_width), height(_height) {
}

Layer::Layer(Node **_nodes, uint8_t _nodesCount) :
    nodes(_nodes), nodesCount(_nodesCount) {
}

void Layer::draw() {
  for (uint8_t i = 0; i < nodesCount; i++) {
    nodes[i]->draw();
  }
}

GridLayer::GridLayer(Grid _grid, Node **nodes, uint8_t nodesCount) :
    Layer(nodes, nodesCount), grid(_grid) {
}

PixelLayer::PixelLayer(Node **nodes, uint8_t nodesCount) :
    Layer(nodes, nodesCount) {
}
