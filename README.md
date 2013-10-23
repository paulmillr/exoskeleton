# Exoskeleton

Faster and leaner Backbone.js drop-in replacement.

http://exosjs.com

## What already works
All features you need for real-world app are working.
All software tests are passing: (libs = underscore and jquery)

* Backbone: **with and without** libs
* [Chaplin](http://chaplinjs.org): **with and without** libs

## Building

    make # Will create exoskeleton.js
    make noutils # If you want to use Underscore and jQuery
                # and don't want to include `Exoskeleton.utils`.
    # Custom, like this:
    cat lib/{header,events,collection,sync,history,footer}.js > exoskeleton.js

## Current features

* Custom build (you can `cat` stuff now)
* No hard dependencies on underscore or jquery
* Query-string router
* Speed: blazing fast when used without jQuery.
* `View#delegateEvents` has `keepOld` option that allows to preserve old events.
* All params are allowed for model attributes, for example `model.get('constructor')` [(jashkenas/backbone#1495)](https://github.com/jashkenas/backbone/issues/1495)
* Support for Bower and Component(1)
* AMD support
* Declaratively defined view events which point to
  non-existing handler functions are no longer tolerated / skipped.
  Early error is thrown instead.

## Differences

- In no-underscore environment, there are no underscore-inspired
  Collection methods (each, pluck etc.), but there are ES5-inspired methods:

  `forEach, map, filter, some, every, reduce, reduceRight, indexOf, lastIndexOf`

  Also, no underscore-inspired Model methods at all.

- emulateHTTP and emulateJSON were removed
