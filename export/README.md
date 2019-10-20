# Tiny Export

Export tool for [Tiny](https://github.com/ampatspell/tiny) - Arduboy sprite and scene editor.

## Install

```
mkdir thing
cd thing
npm init -f
npm intall tiny-export
```

## Usage

Create config for your export:

``` javascript
// config.js
const path = require('path');

const root = __dirname;

module.exports =  {
  target: path.join(root, 'src'),
  cache:  {
    payload: path.join(root, 'payload-cache.json'),
    readable: path.join(root, 'payload-readable.json')
  },
  url: 'https://...your-app-id.cloudfunctions.net/export-project',
  token: 'token for project you want to export'
};
```

Create `fetch.js` which will fetch and cache locally your current project (sprites, scenes):

``` javascript
// fetch.js
let config = require('./config');
let { run } = require('tiny-export');

run(config, async runtime => {

  await runtime.fetch();

});
```

Run fetch:

``` bash
node ./fetch.js
```

Create `generate.js` which will take cached json and generate C++ code:

``` javascript
// generate.js
let config = require('./config');
let { run } = require('tiny-export');
let path = require('path');

let local = filename => path.join(__dirname, filename);

run(config, async runtime => {

  let payload = await runtime.project();

  let pair = async (filename, props) => {
    let file = ext => runtime.render(local(`templates/${filename}.${ext}.ejs`), props);
    await Promise.all([
      runtime.write(`${filename}.cpp`, file('cpp')),
      runtime.write(`${filename}.h`, file('h'))
    ]);
  }

  await pair('tiny', payload);

});
```

For this example I'm generating `tiny.cpp` and `tiny.h` using `tiny.cpp.ejs` and `tiny.h.ejs` (which are identical for this example):

``` cpp
<%# templates/tiny.cpp.ejs %>
<%# templates/tiny.h.ejs %>
namespace Tiny {
  // Project: <%= title %>

  // Sprites
<% project.sprites.forEach(sprite => { %>
  // <%= sprite.index %>: <%= sprite.identifier %> <%= sprite.size.width %> <%= sprite.size.height %>
<% }) %>
}
```

Run generate:

``` bash
node ./generate.js
```

For more decent export example, see https://github.com/ampatspell/tiny/tree/master/player/tiny/generate

## API

### Project

``` javascript
let project = runtime.project();
```

* `project.title` → `String`
* `project.properties` → `Properties`
* `project.models` → `Array<Sprite|Scene|Layer|Node>`
* `project.sprites` → `Array<Sprite>`
* `project.scenes` → `Array<Scene>`

### Entity

``` javascript
let project = runtime.project();
project.models.forEach(entity => {
  //
});
```

* `entity.id` → `String`
* `entity.type` → `String`
* `entity.identifier` → `String`
* `entity.classified` → `String`
* `entity.index` → `Number`
* `entity.properties` → `Properties`

### Sprite

``` javascript
let project = runtime.project();
project.sprites.forEach(sprite => {
  //
});
```

* `sprite.size` → `{ width, height }`
* `sprite.frames` → `Array<Frame>`
* `sprite.loops` → `Array<Loop>`
* `sprite.toPlusMaskString()` → `String`

### Frame

``` javascript
let project = runtime.project();
let sprite = project.sprites.byIdentifier('weirdo');
sprite.frames.forEach(frame => {
  //
});
```

* `frame.bytes` → `Array<Number>`
* `frame.toPlusMaskString()` → `String`

See Bytes section below for `frame.bytes` value meanings.

### Loop

``` javascript
let project = runtime.project();
let sprite = project.sprites.byIdentifier('weirdo');
sprite.loops.forEach(loop => {
  //
});
```

* `loop.frames` → `Array<Frame>`
* `loop.toFrameIndexes()` → `Array<Number>`
* `loop.toFrameIndexesString()` → `String`

### Scene

``` javascript
let project = runtime.project();
project.scenes.forEach(scene => {
  //
});
```

* `scene.background` → `black`, `white`, `transparent`
* `scene.name` → `String`
* `scene.size` → `{ width, height }`
* `scene.layers` → `Array<Layer>`

### Layer

``` javascript
let project = runtime.project();
let scene = project.sceneByIdentifier('01');
scene.layers.forEach(layer => {
  //
});
```

* `layer.identifier` → `String`
* `layer.type` → `pixel`, `grid`
* `layer.grid` → `{ width, heigt }` if type is `grid`
* `layer.nodes` → `Array<Node>`

### Node

``` javascript
let project = runtime.project();
let scene = project.scenes.byIdentifier('01');
let layer = scene.layers.byIdentifier('background');
```

* `node.position` → `{ x, y }`
* `node.alignment` → `{ horizontal: 'left', vertical: 'top' }`
* `node.flip` → `{ horizontal: false', vertical: false }`
* `node.color` → `String` (for `fill` type)
* `node.sprite` → `Sprite` (for `sprite/..` types)
* `node.frame` → `Frame` (for `sprite/frame` type)
* `node.loop` → `Loop` (for `sprite/loop` type)

## Properties

``` javascript
let project = runtime.project();
let properties = project.properties;
```

* `properties.all` → `Object`
* `properties.keys` → `Array<String>`
* `properties.get(key, defaultValue)` → `any`

## Bytes

``` javascript
let width = 4;
let bytes = [ 0, 1, 2, 2, 2, 1, 0, 0 ];
//
//      y
//  0,0 | 0 1 2 3
// x -- +---------+
//    0 | 0 1 2 2 |
//    1 | 2 1 0 0 |
//      +---------+
//
```

``` javascript
export const Pixel = {
  transparent: 0,
  white: 1,
  black: 2
};
```
