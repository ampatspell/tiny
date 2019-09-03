# Notes

```
/users/:uid
  /games
    /new
    /game/:id
      /sprites
        /new
        /delete
        /sprite/:id
```

# Sprites

* Editor starts with 16x16
* Resize canvas
* click to toggle. have black/white/transparent fg/bg
* preview 1x, 2x, 4x
* sprite has 1 or more frames
* animation preview. fixed and walk
* generate preview gifs (still and animated)
* pixel values are `0, 1, 2`

``` javascript
// /users/{uid}/games/{game-id}/sprites/{sprite-id}
{
  name: 'hello',
  dimensions: {
    width: 16,
    height: 16
  },
  derived: {
    frames
  },
  thumbnail: {
    url
  }
}
```

``` javascript
// /users/{uid}/games/{game-id}/sprites/{sprite-id}/frames/0
{
  pixels: [
    // 16 * 16
    'b', 'w', 't', ...
  ]
}
```
