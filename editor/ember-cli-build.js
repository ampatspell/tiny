'use strict';

const EmberApp = require('ember-cli/lib/broccoli/ember-app');
const Funnel = require('broccoli-funnel');

module.exports = function(defaults) {
  let app = new EmberApp(defaults, {
    sassOptions: {
      includePaths: [
        'app'
      ],
      onlyIncluded: true
    },
  });

  app.import('node_modules/konva/konva.js');
  app.import('vendor/konva-shim.js');

  app.import('node_modules/gif.js/dist/gif.js');
  app.import('vendor/gif-shim.js');

  let gif = new Funnel('node_modules/gif.js/dist', {
    srcDir: '/',
    destDir: 'assets',
    include: [ 'gif.worker.js' ]
  });

  return app.toTree([ gif ]);
};
