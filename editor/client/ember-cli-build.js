'use strict';

const EmberApp = require('ember-cli/lib/broccoli/ember-app');

module.exports = function(defaults) {
  let app = new EmberApp(defaults, {
    name: 'editor',
    sassOptions: {
      includePaths: [
        'app'
      ],
      onlyIncluded: true
    },
  });

  app.import('node_modules/konva/konva.js');
  app.import('vendor/konva-shim.js');

  app.import('node_modules/dragula/dist/dragula.js');
  app.import('vendor/dragula-shim.js');

  return app.toTree();
};
