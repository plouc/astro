var _ = require('underscore');


var Pool = function() {
  this.providers = [];
};

Pool.prototype.add = function(provider) {
  this.providers.push(provider);
};


Pool.prototype.generateHandlers = function(tokens) {
  var tokenHandlers = {},
    self = this;

  _.each(tokens, function(token) {
    _.each(self.providers, function(provider) {
      if (provider.has(token)) {
        tokenHandlers[token] = provider.generateHandler(token);
      }
    });
  });

  console.log('HANDLERS >>>', tokenHandlers);

  return tokenHandlers;
};


Pool.prototype.get = function(providerName) {
  var foundProvider = false;
  _.each(this.providers, function(provider) {
    if (provider.name === providerName) {
      foundProvider = provider;
    }
  });

  return foundProvider;
};


Pool.prototype.supporting = function(feature) {
  var supporting = false;
  _.each(this.providers, function(provider) {
    if (provider.support(feature)) {
      supporting = provider;
    }
  });

  return supporting;
};

module.exports = Pool;