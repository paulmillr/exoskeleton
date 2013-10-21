// Backbone.View
// -------------

// Backbone Views are almost more convention than they are actual code. A View
// is simply a JavaScript object that represents a logical chunk of UI in the
// DOM. This might be a single item, an entire list, a sidebar or panel, or
// even the surrounding frame which wraps your whole app. Defining a chunk of
// UI as a **View** allows you to define your DOM events declaratively, without
// having to worry about render order ... and makes it easy for the view to
// react to specific changes in the state of your models.

// Options with special meaning *(e.g. model, collection, id, className)* are
// attached directly to the view.  See `viewOptions` for an exhaustive
// list.

// Cached regex to split keys for `delegate`.
var delegateEventSplitter = /^(\S+)\s*(.*)$/;

// List of view options to be merged as properties.
var viewOptions = ['model', 'collection', 'el', 'id', 'attributes', 'className', 'tagName', 'events'];

// Creating a Backbone.View creates its initial element outside of the DOM,
// if an existing element is not provided...
var View = Backbone.View = function(options) {
  this.cid = _.uniqueId('view');
  if (options) Object.keys(options).forEach(function(key) {
    if (viewOptions.indexOf(key) !== -1) this[key] = options[key];
  }, this);
  this._handlers = [];
  this._ensureElement();
  this.initialize.apply(this, arguments);
  this.delegateEvents();
};

// Set up all inheritable **Backbone.View** properties and methods.
_.extend(View.prototype, Events, {

  // The default `tagName` of a View's element is `"div"`.
  tagName: 'div',

  // jQuery delegate for element lookup, scoped to DOM elements within the
  // current view. This should be preferred to global lookups where possible.
  $: function(selector) {
    return Backbone.$ ? this.$el.find(selector) : this.findAll(selector);
  },

  // Scoliosis-related DOM methods.
  find: function(selector) {
    return this.el.querySelector(selector);
  },

  findAll: function(selector) {
    return slice.call(this.el.querySelectorAll(selector));
  },

  // Initialize is an empty function by default. Override it with your own
  // initialization logic.
  initialize: function(){},

  // **render** is the core function that your view should override, in order
  // to populate its element (`this.el`), with the appropriate HTML. The
  // convention is for **render** to always return `this`.
  render: function() {
    return this;
  },

  // Remove this view by taking the element out of the DOM, and removing any
  // applicable Backbone.Events listeners.
  remove: function() {
    if (Backbone.$) {
      this.$el.remove()
    } else if (this.el.parentNode) {
      this.el.parentNode.removeChild(this.el);
    }
    this.stopListening();
    return this;
  },

  // Change the view's element (`this.el` property), including event
  // re-delegation.
  setElement: function(element, delegate) {
    if (Backbone.$) {
      if (this.$el) this.undelegateEvents();
      this.$el = element instanceof Backbone.$ ? element : Backbone.$(element);
      this.el = this.$el[0];
    } else {
      if (this.el) this.undelegateEvents();
      var el = (typeof element === 'string') ?
        document.querySelector(element) : element;
      this.el = el;
    }
    if (delegate !== false) this.delegateEvents();
    return this;
  },

  delegate: function(eventName, selector, callback) {
    if (typeof selector === 'function') {
      callback = selector;
      selector = null;
    }

    if (typeof callback !== 'function') {
      throw new TypeError('View#delegate expects callback function');
    }

    var root = this.el;
    var bound = callback.bind(this);
    var handler = selector ? function(event) {
      // if (event.target === root) {
      //   event.delegateTarget = el;
      //   return bound(event);
      // }
      for (var el = event.target; el && el !== root; el = el.parentNode) {
        if (utils.matchesSelector(el, selector)) {
          event.delegateTarget = el;
          return bound(event);
        }
      }
    } : bound;

    root.addEventListener(eventName, handler, false);
    this._handlers.push({
      eventName: eventName, selector: selector,
      callback: callback, handler: handler
    });
    return handler;
  },

  undelegate: function(eventName, selector, callback) {
    if (typeof selector === 'function') {
      callback = selector;
      selector = null;
    }

    var root = this.el;
    var handlers = this._handlers;
    var removeListener = function(item) {
      root.removeEventListener(item.eventName, item.handler, false);
    };

    // Remove all handlers.
    if (!eventName && !selector && !callback) {
      handlers.forEach(removeListener);
      this._handlers = [];
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
  },

  // Set callbacks, where `this.events` is a hash of
  //
  // *{"event selector": "callback"}*
  //
  //     {
  //       'mousedown .title':  'edit',
  //       'click .button':     'save',
  //       'click .open':       function(e) { ... }
  //     }
  //
  // pairs. Callbacks will be bound to the view, with `this` set properly.
  // Uses event delegation for efficiency.
  // Omitting the selector binds the event to `this.el`.
  // This only works for delegate-able events: not `focus`, `blur`, and
  // not `change`, `submit`, and `reset` in Internet Explorer.
  delegateEvents: function(events, keepOld) {
    if (!(events || (events = _.result(this, 'events')))) return this;
    if (!keepOld) this.undelegateEvents();
    for (var key in events) {
      var method = events[key];
      if (typeof method !== 'function') method = this[events[key]];
      if (!method) continue;

      var match = key.match(delegateEventSplitter);
      var eventName = match[1], selector = match[2];

      if (Backbone.$) {
        eventName += '.delegateEvents' + this.cid;
        method = method.bind(this);
        this.$el.on(eventName, (selector ? selector : null), method);
      } else {
        this.delegate(eventName, selector, method)
      }
    }
    return this;
  },

  // Clears all callbacks previously bound to the view with `delegateEvents`.
  // You usually don't need to use this, but may wish to if you have multiple
  // Backbone views attached to the same DOM element.
  undelegateEvents: function() {
    if (Backbone.$) {
      this.$el.off('.delegateEvents' + this.cid);
    } else {
      this.undelegate();
    }
    return this;
  },

  // Ensure that the View has a DOM element to render into.
  // If `this.el` is a string, pass it through `$()`, take the first
  // matching element, and re-assign it to `el`. Otherwise, create
  // an element from the `id`, `className` and `tagName` properties.
  _ensureElement: function() {
    if (!this.el) {
      var attrs = _.extend({}, _.result(this, 'attributes'));
      if (this.id) attrs.id = _.result(this, 'id');
      if (this.className) attrs.className = _.result(this, 'className');
      if (attrs['class']) attrs.className = attrs['class'];
      var el = _.extend(document.createElement(_.result(this, 'tagName')), attrs);
      this.setElement(el, false);
    } else {
      this.setElement(_.result(this, 'el'), false);
    }
  }

});
