# Tiny: sprite and scene editor for Arduboy games

Work in progress. Haven't built any games with it yet.

<div style="margin: 0 auto">
![](https://github.com/ampatspell/tiny/blob/master/other/emulator-1.png?raw=true)
</div>

![](https://github.com/ampatspell/tiny/blob/master/other/screenshot-1.png?raw=true)

![](https://github.com/ampatspell/tiny/blob/master/other/screenshot-2.png?raw=true)

## Setup

* `config.js`
* `development-service-account-key.json`
* `production-service-account-key.json`
* `firebase/.firebaserc`

``` javascript
// config.js
module.exports = {
  'development-project-id': {
    firebase: {
      apiKey: "...",
      authDomain: "...",
      databaseURL: "...",
      projectId: "...",
      storageBucket: "...",
      appId: "..."
    }
  },
  'test-project-id': {
    firebase: {
      apiKey: "...",
      authDomain: "...",
      databaseURL: "...",
      projectId: "...",
      storageBucket: "...",
    }
  }
};

```

``` javascript
// .firebaserc
{
  "projects": {
    "development": "development-project-id",
    "test": "test-project-id"
  }
}
```

## Deployment

``` bash
$ npm run deploy:development:all
```

## Export

``` bash
$ curl \
  -d '{ "token": "Ny7qX8WIN5zW05mpPwqqWk43" }' \
  -H "Content-Type: application/json" \
  -X POST \
  https://....app-id.cloudfunctions.net/export-world
```

``` javascript
const fetch = async (url, token) => {
  let fetch = require('node-fetch');
  let response = await fetch(url, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ token })
  });
  return await response.json();
}

let url = 'https://....app-id.cloudfunctions.net/export-world';
let json = await fetch(url, 'Ny7qX8WIN5zW05mpPwqqWk43');
```

See `player/tiny` for proper export example using `export` tools.

## Player example

You'll need a PlatformIO to build and it.

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

## Firestore structure

### Project

``` javascript
// projects/{project-id}
{
  owner: uid,
  title: 'Hello'
}
```

### Project / Sprite

``` javascript
// projects/{project-id}/sprites/{sprite-id}
{
  identifier: 'weirdo',
  name: 'Weirdo',
  size: {
    width: 16,
    height: 16
  },
  thumbnail: 'https://.../thumbnail.gif'
}
```

### Project / Sprite / Frame

``` javascript
// projects/{project-id}/sprites/{sprite-id}/frames/{frame-id}
{
  bytes: blob,
  index: 0
}
```

### Project / Sprite / Loop

``` javascript
// projects/{project-id}/sprites/{sprite-id}/loops/{frame-id}
{
  identifier: 'wink',
  frames: [
    "frame-id",
  ]
}
```

### Project / World

``` javascript
// projects/{project-id}/worlds/{world-id}
{
  name: 'First',
  token: 'export-token',
  thumbnail: 'https://.../thumbnail.png'
}
```

### Project / World / Scene

``` javascript
// projects/{project-id}/worlds/{world-id}/scenes/{scene-id}
{
  name: 'One',
  identifier: '01',
  background: 'black', // black, white, transparent
  collapsed: false, // ui
  hidden: false,
  index: 0, // ui
  locked: false, // ui
  position: { // ui
    x: 0,
    y: 0
  },
  size: { // px
    width: 128,
    height: 64
  }
}
```

### Project / World / Scene / Layer

Grid layer

``` javascript
// projects/{project-id}/worlds/{world-id}/scenes/{scene-id}/layers/{layer-id}
{
  type: 'grid',
  identifier: 'background',
  collapsed: false, // ui
  index: 1, // ui
  locked: false, // ui
  grid: {
    width: 8,
    height: 8
  }
}
```

Pixel layer

``` javascript
// projects/{project-id}/worlds/{world-id}/scenes/{scene-id}/layers/{layer-id}
{
  type: 'pixel',
  identifier: 'background',
  collapsed: false, // ui
  index: 1, // ui
  locked: false // ui
}
```

### Project / World / Scene / Layer / Node

Sprite frame

``` javascript
// projects/{project-id}/worlds/{world-id}/scenes/{scene-id}/layers/{layer-id}/nodes/{node-id}
{
  type: 'sprite/frame',
  sprite: "spider",
  frame: "frame-identifier",
  identifier: "the-spider",
    position: {
    x: 104,
    y: 40
  },
  alignment: {
    horizontal: 'left',
    vertical: 'top'
  },
  flip: {
    horizontal: false,
    vertical: false
  },
  index: 0, // ui,
  locked: false // ui
}
```

Sprite loop

``` javascript
// projects/{project-id}/worlds/{world-id}/scenes/{scene-id}/layers/{layer-id}/nodes/{node-id}
{
  type: 'sprite/loop',
  sprite: "spider",
  loop: "loop-identifier",
  identifier: "the-spider",
    position: {
    x: 104,
    y: 40
  },
  alignment: {
    horizontal: 'left',
    vertical: 'top'
  },
  flip: {
    horizontal: false,
    vertical: false
  },
  index: 0, // ui,
  locked: false // ui
}
```
