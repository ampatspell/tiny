'use strict';

let get = require('../../get-config')

const getConfig = environment => {
  let opts = {};
  if(environment !== 'production') {
    opts.alias = 'development';
  }
  let { alias, firebase, client } = get(opts);
  let { version } = require('../package.json');
  return {
    version,
    alias,
    firebase,
    client
  };
};

module.exports = function(environment) {
  let ENV = {
    modulePrefix: 'editor',
    environment,
    rootURL: '/',
    locationType: 'auto',
    EmberENV: {
      FEATURES: {
      },
      EXTEND_PROTOTYPES: {
        Date: false
      }
    },
    fontawesome: {
      icons: {
        'free-solid-svg-icons': 'all',
        'free-regular-svg-icons': 'all'
      }
    },
    APP: {
    }
  };

  ENV.editor = getConfig(environment);

  if (environment === 'development') {
    // ENV.APP.LOG_RESOLVER = true;
    // ENV.APP.LOG_ACTIVE_GENERATION = true;
    // ENV.APP.LOG_TRANSITIONS = true;
    // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    // ENV.APP.LOG_VIEW_LOOKUPS = true;
  }

  if (environment === 'test') {
    // Testem prefers this...
    ENV.locationType = 'none';

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = '#ember-testing';
    ENV.APP.autoboot = false;
  }

  if (environment === 'production') {
    // here you can enable a production-specific feature
  }

  return ENV;
};
