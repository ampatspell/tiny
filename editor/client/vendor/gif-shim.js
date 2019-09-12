(function() {

  function vendorModule() {
    'use strict';
    return self['GIF'];
  }

  define('gif', [], vendorModule);
})();
