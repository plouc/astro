var _ = require('underscore');


/**
 * This class contains a collection of providers.
 *
 * @constructor
 */
var Pool = function() {
  // an array + an object ar used to store the providers.
  // the array is used for processing, and the object
  // to get a provider by its name without having to loop on the array.
  this.providers       = [];
  this.providersByName = {};
};

/**
 * Add a provider.
 *
 * @param provider
 */
Pool.prototype.add = function(provider) {
  this.providers.push(provider);
  this.providersByName[provider.name] = provider;
};


/**
 * Get a provider by its name.
 *
 * @param providerName
 * @return {Boolean|Provider}
 */
Pool.prototype.get = function(providerName) {
  if (this.providersByName.hasOwnProperty(providerName)) {
    return this.providersByName[providerName];
  }

  return false;
};


/**
 * Remove a provider.
 *
 * @param providerName
 */
Pool.prototype.remove = function(providerName) {

};


/**
 * Generate handlers for given token if one provider supports it
 *
 * @param token
 * @return {Object}
 */
Pool.prototype.generateHandlers = function(token) {
  var tokenHandlers = {},
    self = this;

  _.each(self.providers, function(provider) {
    if (provider.support(token)) {
      tokenHandlers[token] = provider.generateHandler(token);
    }
  });

  console.log('HANDLERS >>>', tokenHandlers);

  return tokenHandlers;
};


module.exports = Pool;