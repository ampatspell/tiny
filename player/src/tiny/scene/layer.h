#pragma once

namespace Tiny {

class Layer {
public:
  Layer() {}
};

class GridLayer: public Layer {
public:
  GridLayer(): Layer() {}
};

class PixelLayer: public Layer {
public:
  PixelLayer(): Layer() {}
};

}
