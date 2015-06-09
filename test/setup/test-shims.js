(function() {
  Backbone.Collection.prototype.first = function(n, guard) {
    var array = this.models;
    return (n == null) || guard ? array[0] : slice.call(array, 0, n);
  };

  Backbone.Collection.prototype.last = function(n, guard) {
    var array = this.models;
    if ((n == null) || guard) {
      return array[array.length - 1];
    } else {
      return slice.call(array, Math.max(array.length - n, 0));
    }
  };

})()