// Usage:
//   utils.matchesSelector(div, '.something');
utils.matchesSelector = (function() {
  if (typeof document === 'undefined') return;
  // Suffix.
  var sfx = 'MatchesSelector';
  var tag = document.createElement('div');
  var name;
  ['matches', 'webkit' + sfx, 'moz' + sfx, 'ms' + sfx].some(function(item) {
    var valid = (item in tag);
    name = item;
    return valid;
  });
  if (!name) {
    throw new Error('Element#matches is not supported');
  }
  return function(element, selector) {
    return element[name](selector);
  };
})();

// Make AJAX request to the server.
// Usage:
//   var callback = function(error, data) {console.log('Done.', error, data);};
//   ajax({url: 'url', method: 'PATCH', data: 'data'}, callback);
utils.ajax = (function() {
  var xmlRe = /^(?:application|text)\/xml/;
  var jsonRe = /^application\/json/;

  var getData = function(accepts, xhr) {
    if (accepts == null) accepts = xhr.getResponseHeader('content-type');
    if (xmlRe.test(accepts)) {
      return xhr.responseXML;
    } else if (jsonRe.test(accepts)) {
      return JSON.parse(xhr.responseText);
    } else {
      return xhr.responseText;
    }
  };

  var isValid = function(xhr) {
    return (xhr.status >= 200 && xhr.status < 300) ||
      (xhr.status === 304) ||
      (xhr.status === 0 && window.location.protocol === 'file:')
  };

  var end = function(xhr, options, deferred) {
    return function() {
      if (xhr.readyState !== 4) return;

      var status = xhr.status;
      var data = getData(options.headers && options.headers.Accept, xhr);

      // Check for validity.
      if (isValid(xhr)) {
        if (options.success) options.success(data);
        if (deferred) deferred.resolve(data);
      } else {
        var error = new Error('Server responded with a status of ' + status);
        if (options.error) options.error(xhr, status, error);
        if (deferred) deferred.reject(xhr);
      }
    }
  };

  return function(options) {
    if (options == null) throw new Error('You must provide options');
    if (options.method == null) options.method = 'GET';

    var xhr = new XMLHttpRequest();
    var deferred = Backbone.Deferred && Backbone.Deferred();

    if (options.credentials) options.withCredentials = true;
    xhr.addEventListener('readystatechange', end(xhr, options, deferred));
    xhr.open(options.method, options.url, true);
    if (options.headers) for (var key in options.headers) {
      xhr.setRequestHeader(key, options.headers[key]);
    }
    xhr.send(options.data);

    return deferred ? deferred.promise : undefined;
  };
})();
