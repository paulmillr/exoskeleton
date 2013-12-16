# Exoskeleton 0.6.3 (16 December 2013)
* Added `View#useNative` property. Works great
  if you want to include jQuery and still use native methods
  for some views. Just set it to `true` in them.

# Exoskeleton 0.6.2 (14 December 2013)
* Added support for `data` option in `utils.ajax`.

# Exoskeleton 0.6.1 (9 December 2013)
* Fixed handling of missing common.js jQuery dependency.

# Exoskeleton 0.6.0 (28 November 2013)
* **Breaking:** removed `View#delegate` and `View#undelegate`.
  These methods now reside in `utils` and can be excluded
  in custom builds.
* Collection model ids can now be arbitrary js props.
  E.g. `collection.get('toString')`.
* `Collection#find` now works in no-underscore environment.

# Exoskeleton 0.5.1 (3 November 2013)
* Added support for `contentType` option in `utils.ajax`

# Exoskeleton 0.5.0 (2 November 2013)
* Fixed behaviour in node.js environment.
* `Backbone.Deferred` now must return actual `Deferred`
  (`{promise, resolve, reject}` object).
* Removed `Backbone.resolveDeferred`.
* Added `beforeSend` option to `utils.ajax`.
* Moved `utils.ajax({method})` option to `{type}`.
* When used with custom build of lodash, Collection and Model
  will now use all existing methods.
* Improved performance of event triggering.

# Exoskeleton 0.4.0 (29 October 2013)
* Default AJAX functionality is now covered by `utils.ajax`
* Added `Backbone.Deferred` and `Backbone.resolveDeferred`.
  Promise returned by `Backbone.Deferred` is returned via ajax.
* Fixed IE support.
* Removed `utils.sortedIndex`.
* Small optimisations.

# Exoskeleton 0.3.1 (24 October 2013)
* Fix broken bower.json package

# Exoskeleton 0.3.0 (24 October 2013)
* Declaratively defined view events which point to
  non-existing handler functions are no longer tolerated / skipped.
  Early error is thrown instead.

# Exoskeleton 0.2.2 (21 October 2013)
* All Chaplin tests are now passing.
* Added `utils.matchesSelector`.

# Exoskeleton 0.2.1 (19 October 2013)
* Fixed AMD support.

# Exoskeleton 0.2.0 (19 October 2013)
* jQuery is now 100% optional, just like underscore.
* All backbone tests are passing with and without jQuery.

# Exoskeleton 0.1.0 (13 October 2013)
* Initial release
