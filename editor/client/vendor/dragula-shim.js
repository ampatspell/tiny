(function() {

  function vendorModule() {
    'use strict';
    return self['dragula'];
  }

  define('dragula', [], vendorModule);
})();
