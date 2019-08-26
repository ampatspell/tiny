'use strict';

const EmberApp = require('ember-cli/lib/broccoli/ember-app');

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

  return app.toTree();
};
