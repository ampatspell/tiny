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
  url: 'https://...your-app-id.cloudfunctions.net/export-world',
  token: 'token for world you want to export'
};
```

Create `fetch.js` which will fetch and cache locally your current world (sprites, scenes):

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

``` ejs
<%# templates/tiny.cpp.ejs %>
<%# templates/tiny.h.ejs %>
namespace Tiny {
  // Project: <%= project.title %>
  // World: <%= world.name %>

  // Sprites
<% sprites.forEach(sprite => { %>
  // <%= sprite.index %>: <%= sprite.identifier %> <%= sprite.size.width %> <%= sprite.size.height %>
<% }) %>
}
```

Run generate:

``` bash
node ./generate.js
```

For more decent export example, see https://github.com/ampatspell/tiny/tree/master/player/tiny/generate
