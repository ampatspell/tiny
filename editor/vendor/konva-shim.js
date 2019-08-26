(function() {

  function vendorModule() {
    'use strict';
    return self['Konva'];
  }

  define('konva', [], vendorModule);
})();
