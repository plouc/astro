var _          = require('underscore'),
  request      = require('request'),
  Provider     = require('./provider'),
  objectAccess = require('../util').objectAccess;


/**
 *
 * @param {string} userToken
 * @param {string} org
 * @param {string} flow
 * @constructor
 */
var FlowProvider = function(userToken, org, flow) {
  this.name        = 'flow';
  this.baseUrl     = 'https://' + userToken + ':whatever@api.flowdock.com/flows/' + org + '/' + flow;
  this.fetched     = false;
  this.infos       = {};
  this.usersById   = {};
  this.usersByNick = {};

  var self = this;

  this.hanlders = {
    '$user': this.getUserById,
    '$self': this.getUserByNick,
    '$flow': function() {
      return self.infos;
    }
  };
};

FlowProvider.prototype = Object.create(Provider.prototype);


/**
 * Fetch info from remote server.
 */
FlowProvider.prototype.fetch = function() {
  var self = this;
  request.get(this.baseUrl)
    .on('data', function(data) {
      try {
        var infos = JSON.parse(data.toString());
        self.infos = infos;
        _.each(infos.users, function(user) {
          user.avatar = user.avatar.substr(0, user.avatar.length - 1) + '.png';
          self.usersById[user.id]     = user;
          self.usersByNick[user.nick] = user;
        });
        self.fetched = true;
      } catch (err) {
        console.log(err);
      }
    });
};

FlowProvider.prototype.getUserByNick = function(nick) {
  return this.usersByNick[nick];
};

FlowProvider.prototype.getUserById = function(id) {
  return this.usersById[id];
};

module.exports.flow = function(userToken, org, flow) {
  var flowProvider = new FlowProvider(userToken, org, flow);
  flowProvider.fetch();

  return flowProvider;
};