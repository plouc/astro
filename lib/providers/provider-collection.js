var _        = require('underscore'),
  Collection = require('../collection');


/**
 * This class contains a collection of providers.
 *
 * @constructor
 */
var ProviderCollection = function() {
  Collection.call(this);
};

ProviderCollection.prototype = Object.create(Collection.prototype);

/**
 * Generate handlers for given token if one provider supports it
 *
 * @param token
 * @return {Object}
 */
ProviderCollection.prototype.generateHandlers = function(token) {
  var tokenHandlers = {},
    self = this;

  _.each(self.items, function(provider) {
    if (provider.support(token)) {
      tokenHandlers[token] = provider.generateHandler(token);
    }
  });

  console.log('HANDLERS >>>', tokenHandlers);

  return tokenHandlers;
};


module.exports = ProviderCollection;