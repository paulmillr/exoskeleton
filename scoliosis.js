//     Scoliosis.js 1.0.0

//     (c) 2013 Paul Miller (http://paulmillr.com)
//     (c) 2010-2011 Jeremy Ashkenas, DocumentCloud Inc.
//     (c) 2011-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
//     Scoliosis may be freely distributed under the MIT license.
//     For all details and documentation:
//     https://github.com/paulmillr/scoliosis

(function(undefined) {
  'use strict';

  var root = (typeof global === 'undefined') ? window : global;

  if (typeof define === 'function' && typeof define.amd == 'object' && define.amd) {
    define(main); // RequireJS
  } else if (typeof module === 'object' && module.exports) {
    module.exports = main();
  } else {
    main(); // CommonJS and <script>
  }
})();
