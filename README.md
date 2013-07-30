# scoliosis

Experiment in making better Backbone.js drop-in replacement.

## What already works

Well, [Chaplin](http://chaplinjs.org) passes all its tests with Scoliosis instead of Backbone. That’s it. All features you need for real-world app seems to be working.

## Plans

- [ ] Custom build (you can `cat` stuff now)
- [ ] Query-string router
- [x] No hard dependencies on underscore or jquery (done: underscore)
- [ ] Support for Bower and Component(1)
- [ ] AMD support
- [ ] Speed
- [ ] View#noWrap (maybe)
- [ ] View#delegateEvents(keepOld)
- [ ] extend adds __super__
- [ ] Object.create(null) https://github.com/jashkenas/backbone/issues/1495
- [ ] Builds for modern browsers (IE9+)

## Removed features

- emulateHTTP and emulateJSON.
