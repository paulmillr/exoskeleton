# Exoskeleton

Exoskeleton is a faster and leaner Backbone for your HTML5 apps.

http://exosjs.com

## What already works
All features you need for real-world app are working.
All software tests are passing: underscore

* Backbone: **with and without** Underscore
* [Chaplin](http://chaplinjs.org): **with and without** Underscore

Marionette and other popular plugins: WIP.

## Building

Default **and custom** builds:

    make # Will create exoskeleton.js
    make noutils # If you want to use Underscore
                 # and don't want to include `Exoskeleton.utils`.
    make min     # Minified version.
    # Custom, like this:
    cat lib/{header,events,collection,sync,history,footer}.js > exoskeleton.js

## Features

* Custom builds
* No hard dependencies on underscore
* Support for Bower and [Component(1)](https://github.com/component/component)
* AMD support
* Speed: blazing fast when used without jQuery with
  [Backbone.NativeView](https://github.com/akre54/Backbone.NativeView) and
  [Backbone.NativeAjax](https://github.com/akre54/Backbone.NativeAjax) (see
  the [wiki page](https://github.com/paulmillr/exoskeleton/wiki/Exoskeleton-without-jQuery)).

Also:

* All params are allowed for model attributes, for example `model.get('constructor')` [(jashkenas/backbone#1495)](https://github.com/jashkenas/backbone/issues/1495)
* Event triggering on disposed objects is [20 times faster](http://jsperf.com/exoskeleton-events-vs-backbone-events)

## Differences

* Declaratively defined view events which point to
  non-existing handler functions are no longer tolerated / skipped.
  Early error is thrown instead.
* In no-underscore environment, there are no underscore-inspired
  Collection methods (each, pluck etc.), but there are ES5-inspired methods:

  `forEach, map, filter, some, every, reduce, reduceRight, indexOf, lastIndexOf`

  Also, no underscore-inspired Model methods at all.

* emulateHTTP and emulateJSON were removed
