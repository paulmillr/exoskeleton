(function() {

  var view;

  module("Backbone.View", {

    setup: function() {
      view = new Backbone.View({
        id        : 'test-view',
        className : 'test-view',
        other     : 'non-special-option'
      });
    }

  });

  test("constructor", 3, function() {
    equal(view.el.id, 'test-view');
    equal(view.el.className, 'test-view');
    equal(view.el.other, void 0);
  });

  test("jQuery", 1, function() {
    var view = new Backbone.View;
    var el = document.createElement('p');
    el.innerHTML = '<a><b>test</b></a>';
    view.setElement(el);
    strictEqual(view.$('a b')[0].innerHTML, 'test');
  });

  test("initialize", 1, function() {
    var View = Backbone.View.extend({
      initialize: function() {
        this.one = 1;
      }
    });

    strictEqual(new View().one, 1);
  });

  test("delegateEvents", 6, function() {
    var counter1 = 0, counter2 = 0;

    var el = document.createElement('p');
    el.innerHTML = '<a id="test"></a>';
    var view = new Backbone.View({el: el});
    view.increment = function(){ counter1++; };
    view.el.addEventListener('click', function(){ counter2++; }, false);

    var events = {'click #test': 'increment'};

    view.delegateEvents(events);
    view.$('#test')[0].click();
    equal(counter1, 1);
    equal(counter2, 1);

    view.$('#test')[0].click();
    equal(counter1, 2);
    equal(counter2, 2);

    view.delegateEvents(events);
    view.$('#test')[0].click();
    equal(counter1, 3);
    equal(counter2, 3);
  });

  test("delegateEvents allows functions for callbacks", 3, function() {
    var view = new Backbone.View({el: document.createElement('p')});
    view.counter = 0;

    var events = {
      click: function() {
        this.counter++;
      }
    };

    view.delegateEvents(events);
    view.$el.click();
    equal(view.counter, 1);

    view.$el.click();
    equal(view.counter, 2);

    view.delegateEvents(events);
    view.$el.click();
    equal(view.counter, 3);
  });


  test("delegateEvents ignore undefined methods", 0, function() {
    var view = new Backbone.View({el: document.createElement('p')});
    view.delegateEvents({'click': 'undefinedMethod'});
    view.$el.click();
  });

  test("undelegateEvents", 6, function() {
    var counter1 = 0, counter2 = 0;
    var el = document.createElement('p');
    el.innerHTML = '<a id="test"></a>';

    var view = new Backbone.View({el: el});
    view.increment = function(){ counter1++; };
    view.$el.addEventListener('click', function(){ counter2++; }, false);

    var events = {'click #test': 'increment'};

    view.delegateEvents(events);
    view.$('#test')[0].click();
    equal(counter1, 1);
    equal(counter2, 1);

    view.undelegateEvents();
    view.$('#test')[0].click();
    equal(counter1, 1);
    equal(counter2, 2);

    view.delegateEvents(events);
    view.$('#test')[0].click();
    equal(counter1, 2);
    equal(counter2, 3);
  });

  test("_ensureElement with DOM node el", 1, function() {
    var View = Backbone.View.extend({
      el: document.body
    });

    equal(new View().el, document.body);
  });

  // not supported in Scoliosis
  // test("_ensureElement with string el", 3, function() {
  //   var View = Backbone.View.extend({
  //     el: "body"
  //   });
  //   strictEqual(new View().el, document.body);

  //   View = Backbone.View.extend({
  //     el: "#testElement > h1"
  //   });
  //   strictEqual(new View().el, $("#testElement > h1").get(0));

  //   View = Backbone.View.extend({
  //     el: "#nonexistent"
  //   });
  //   ok(!new View().el);
  // });

  test("with className and id functions", 2, function() {
    var View = Backbone.View.extend({
      className: function() {
        return 'className';
      },
      id: function() {
        return 'id';
      }
    });

    strictEqual(new View().el.className, 'className');
    strictEqual(new View().el.id, 'id');
  });

  test("with attributes", 2, function() {
    var View = Backbone.View.extend({
      attributes: {
        id: 'id',
        'class': 'class'
      }
    });

    strictEqual(new View().el.className, 'class');
    strictEqual(new View().el.id, 'id');
  });

  test("with attributes as a function", 1, function() {
    var View = Backbone.View.extend({
      attributes: function() {
        return {'class': 'dynamic'};
      }
    });

    strictEqual(new View().el.className, 'dynamic');
  });

  test("multiple views per element", 3, function() {
    var count = 0;
    var $el = document.createElement('p');

    var View = Backbone.View.extend({
      el: $el,
      events: {
        click: function() {
          count++;
        }
      }
    });

    var view1 = new View;
    $el.click();
    equal(1, count);

    var view2 = new View;
    $el.click();
    equal(3, count);

    view1.delegateEvents();
    $el.click();
    equal(5, count);
  });

  // not yet implemented
  // test("custom events, with namespaces", 2, function() {
  //   var count = 0;

  //   var View = Backbone.View.extend({
  //     el: $('body'),
  //     events: function() {
  //       return {"fake$event.namespaced": "run"};
  //     },
  //     run: function() {
  //       count++;
  //     }
  //   });

  //   var view = new View;
  //   $('body').trigger('fake$event').trigger('fake$event');
  //   equal(count, 2);

  //   $('body').off('.namespaced');
  //   $('body').trigger('fake$event');
  //   equal(count, 2);
  // });

  // test("#1048 - setElement uses provided object.", 2, function() {
  //   var $el = $('body');

  //   var view = new Backbone.View({el: $el});
  //   ok(view.$el === $el);

  //   view.setElement($el = $($el));
  //   ok(view.$el === $el);
  // });

  test("#986 - Undelegate before changing element.", 1, function() {
    var button1 = document.createElement('button');
    var button2 = document.createElement('button');

    var View = Backbone.View.extend({
      events: {
        click: function(e) {
          ok(view.el === e.target);
        }
      }
    });

    var view = new View({el: button1});
    view.setElement(button2);

    button1.click();
    button2.click();
  });

  test("#1172 - Clone attributes object", 2, function() {
    var View = Backbone.View.extend({
      attributes: {foo: 'bar'}
    });

    var view1 = new View({id: 'foo'});
    strictEqual(view1.el.id, 'foo');

    var view2 = new View();
    ok(!view2.el.id);
  });

  test("#1228 - tagName can be provided as a function", 1, function() {
    var View = Backbone.View.extend({
      tagName: function() {
        return 'p';
      }
    });

    equal(new View().el.tagName.toLowerCase(), 'p');
  });

  test("views stopListening", 0, function() {
    var View = Backbone.View.extend({
      initialize: function() {
        this.listenTo(this.model, 'all x', function(){ ok(false); }, this);
        this.listenTo(this.collection, 'all x', function(){ ok(false); }, this);
      }
    });

    var view = new View({
      model: new Backbone.Model,
      collection: new Backbone.Collection
    });

    view.stopListening();
    view.model.trigger('x');
    view.collection.trigger('x');
  });

  test("Provide function for el.", 2, function() {
    var View = Backbone.View.extend({
      el: function() {
        var el = document.createElement("p");
        el.innerHTML = "<a></a>";
        return el;
      }
    });

    var view = new View;
    equal(view.el.tagName.toLowerCase(), 'p');
    ok(view.el.querySelector('a'));
  });

  test("events passed in options", 2, function() {
    var counter = 0;
    var el = document.createElement("p");
    el.innerHTML = '<a id="test"></a>';

    var View = Backbone.View.extend({
      el: el,
      increment: function() {
        counter++;
      }
    });

    var view = new View({events:{'click #test':'increment'}});
    var view2 = new View({events:function(){
      return {'click #test':'increment'};
    }});

    view.$('#test')[0].click();
    view2.$('#test')[0].click();
    equal(counter, 2);

    view.$('#test')[0].click();
    view2.$('#test')[0].click();
    equal(counter, 4);
  });

})();
