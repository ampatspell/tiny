# Tiny: sprite and scene editor for Arduboy games

Work in progress. Haven't built any games with it yet.

<p align="center">
  <img src="https://github.com/ampatspell/tiny/blob/master/other/emulator-1.png?raw=true">
</p>

![](https://github.com/ampatspell/tiny/blob/master/other/screenshot-1.png?raw=true)

![](https://github.com/ampatspell/tiny/blob/master/other/screenshot-2.png?raw=true)

## Editor

## Exporter

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

