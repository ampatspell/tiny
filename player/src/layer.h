#pragma once

#include <globals.h>
#include <stdint.h>

class Node;

struct Grid {

  uint8_t width;
  uint8_t height;

  Grid(uint8_t _width, uint8_t _height);

};

class Layer: public NonAssignable {

  Node **nodes;
  uint8_t nodesCount;

public:

  Layer(Node **_nodes, uint8_t _nodesCount);

  void draw();

};

class GridLayer: public Layer {

  Grid grid;

public:

  GridLayer(Grid _grid, Node **nodes, uint8_t nodesCount);

};

class PixelLayer: public Layer {

public:

  PixelLayer(Node **nodes, uint8_t nodesCount);

};
