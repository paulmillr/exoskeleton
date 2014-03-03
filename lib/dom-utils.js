// Usage:
//   utils.matchesSelector(div, '.something');
utils.matchesSelector = (function() {
  if (typeof document === 'undefined') return;
  // Suffix.
  var sfx = 'MatchesSelector';
  var tag = document.createElement('div');
  var name;
  // Detect the right suffix.
  ['matches', 'webkit' + sfx, 'moz' + sfx, 'ms' + sfx].some(function(item) {
    var valid = (item in tag);
    name = item;
    return valid;
  });
  if (!name) throw new Error('Element#matches is not supported');
  return function(element, selector) {
    return element[name](selector);
  };
})();

utils.delegate = function(view, eventName, selector, callback) {
  if (typeof selector === 'function') {
    callback = selector;
    selector = null;
  }

  if (typeof callback !== 'function') {
    throw new TypeError('View#delegate expects callback function');
  }

  var root = view.el;
  var bound = callback.bind(view);
  var handler = selector ? function(event) {
    for (var el = event.target; el && el !== root; el = el.parentNode) {
      if (utils.matchesSelector(el, selector)) {
        // event.currentTarget or event.target are read-only.
        event.delegateTarget = el;
        return bound(event);
      }
    }
  } : bound;

  root.addEventListener(eventName, handler, false);
  view._handlers.push({
    eventName: eventName, selector: selector,
    callback: callback, handler: handler
  });
  return handler;
};

utils.undelegate = function(view, eventName, selector, callback) {
  if (typeof selector === 'function') {
    callback = selector;
    selector = null;
  }

  var handlers = view._handlers;
  var removeListener = function(item) {
    view.el.removeEventListener(item.eventName, item.handler, false);
  };

  // Remove all handlers.
  if (!eventName && !selector && !callback) {
    handlers.forEach(removeListener);
    view._handlers = [];
  } else {
    // Remove some handlers.
    handlers
      .filter(function(item) {
        return item.eventName === eventName &&
          (callback ? item.callback === callback : true) &&
          (selector ? item.selector === selector : true);
      })
      .forEach(function(item) {
        removeListener(item);
        handlers.splice(handlers.indexOf(item), 1);
      });
  }
};

// Make AJAX request to the server.
// Usage:
//   var callback = function(error, data) {console.log('Done.', error, data);};
//   ajax({url: 'url', type: 'PATCH', data: 'data'}, callback);
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
    if (options.type == null) options.type = 'GET';

    var xhr = new XMLHttpRequest();
    var deferred = Backbone.Deferred && Backbone.Deferred();

    if (options.contentType) {
      if (options.headers == null) options.headers = {};
      options.headers['Content-Type'] = options.contentType;
    }

    // Stringify GET query params.
    if (options.type === 'GET' && typeof options.data === 'object') {
      var query = '';
      var stringifyKeyValuePair = function(key, value) {
        return value == null ? '' :
          '&' + encodeURIComponent(key) +
          '=' + encodeURIComponent(value);
      };
      for (var key in options.data) {
        query += stringifyKeyValuePair(key, options.data[key]);
      }

      if (query) {
        var sep = (options.url.indexOf('?') === -1) ? '?' : '&';
        options.url += sep + query.substring(1);
      }
    }

    if (options.credentials) options.withCredentials = true;
    xhr.addEventListener('readystatechange', end(xhr, options, deferred));
    xhr.open(options.type, options.url, true);
    xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
    if (options.headers) for (var key in options.headers) {
      xhr.setRequestHeader(key, options.headers[key]);
    }
    if (options.beforeSend) options.beforeSend(xhr);
    xhr.send(options.data);

    return deferred ? deferred.promise : undefined;
  };
})();
