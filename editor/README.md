# Tiny Editor

A webapp build with Ember.js and Firebase.

## General setup

To run it locally or deploy to firebase hosting you'll need:

* Node.js: https://nodejs.org
* Firebase Tools: https://github.com/firebase/firebase-tools

Download Node.js latest LTS version from https://nodejs.org

That will add `npm` command tool to your shell. Then,

``` bash
# Install firebase tools
$ npm install -g firebase-tools
# Login
$ firebase login
```

Clone whole repository

``` bash
$ git@github.com:ampatspell/tiny.git
$ cd tiny/editor
```

Now you'll need to create a Firebase project in Google's Firebase console: https://console.firebase.google.com. Click "Add project" and follow the steps.

Then few things:

* Go to Authentication → Sign-in method and enable Email/Password
* Go to Authentication → Users and create user for yourself
* Go to Database and enable Firestore (in locked mode, default or closer to you region is fine)
* Go to Storage and enable it with default security rules
* Go to Settings → Project settings and add a web app.
* Now in the Project Settings below general info, you'll see your webapp, switch to Config in Firebase SDK snippet and copy firebase config which should look like this:

``` javascript
const firebaseConfig = {
  apiKey: "...",
  authDomain: "...",
  databaseURL: "...",
  projectId: "...",
  storageBucket: "...",
  messagingSenderId: "...", // remove this line, not needed for tiny
  appId: "..."
};
```

## Configuration

Create the following files:

* `editor/config.js`
* `editor/firebase/.firebaserc`

``` javascript
// editor/config.js
module.exports = {
  'your-project-id': {
    firebase: {
      apiKey: "...",
      authDomain: "...",
      databaseURL: "...",
      projectId: "your-project-id",
      storageBucket: "...",
      appId: "..."
    }
  }
};
```

``` javascript
// editor/firebase/.firebaserc
{
  "projects": {
    "production": "your-project-id"
  }
}
```

## Install dependencies

``` bash
$ cd editor/client
$ npm install
$ cd editor/firebase/functions
$ npm install
```

## Deploy webapp and cloud functions

``` bash
$ cd editor
$ npm run deploy:production:all
```

Visit your app at url printed out after successful deployment. Login with email/password you created few steps before.

## Run locally

To run it locally, you'll still need Firebase project setup and deployed cloud functions.

``` bash
$ cd editor/client
$ FIREBASE=production ember s
```
