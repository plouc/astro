var _      = require('underscore'),
  request  = require('request'),
  Provider = require('./provider');


/**
 * @constructor
 */
var GithubProvider = function() {
  this.baseUrl     = 'https://api.github.com';

  this.hanlders = {
    '$github': this.getUser
  };
};

GithubProvider.prototype = Object.create(Provider.prototype);


GithubProvider.prototype.getUser = function(user) {

};