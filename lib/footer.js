  // !!!
  // Init.
  Model.extend = Collection.extend = Router.extend = View.extend = History.extend = Backbone.extend;

  // Allow the `Backbone` object to serve as a global event bus, for folks who
  // want global "pubsub" in a convenient place.
  _.extend(Backbone, Events);

  // Create the default Backbone.history.
  Backbone.history = new History;
}));
