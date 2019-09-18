# Tiny Editor

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
