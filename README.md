# Arduboy sprite and scene editor

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
