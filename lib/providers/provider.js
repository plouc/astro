var _          = require('underscore'),
  objectAccess = require('../util').objectAccess;


/**
 * Base provider class.
 *
 * @param config
 * @constructor
 */
var Provider = function(config) {
  this.name     = config.name;
  this.handlers = {};
};


/**
 *
 * @param placeholder
 * @return {*}
 */
Provider.prototype.placeholderToHandlerId = function(placeholder) {
  var parts = placeholder.split('.');
  if (parts.length > 0) {
    return parts[0];
  }

  return placeholder;
};


/**
 * Test if this provider supports the given feature.
 *
 * @param {String} placeholder
 * @return {Boolean}
 */
Provider.prototype.support = function(placeholder) {
  var hasSupport = false,
    featureId    = this.placeholderToHandlerId(placeholder);

  _.each(this.hanlders, function(handler, id) {
    if (hasSupport === false && featureId === id) {
      hasSupport = true;
    }
  });

  return hasSupport;
};


/**
 *
 *
 * @param {string} placeholder
 * @return {Function}
 */
Provider.prototype.generateHandler = function(placeholder) {
  var featureId = this.placeholderToHandlerId(placeholder),
    self        = this;

  return function(value) {
    var responseObject = self.handlers[featureId](value);
    if (!responseObject) {
      return value;
    }

    return objectAccess(responseObject, placeholder);
  };
};


module.exports = Provider;