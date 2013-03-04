var _          = require('underscore'),
  request      = require('request'),
  objectAccess = require('../util').objectAccess;

var FlowProvider = function(userToken, org, flow) {
  this.name        = 'flow';
  this.baseUrl     = 'https://' + userToken + ':whatever@api.flowdock.com/flows/' + org + '/' + flow;
  this.fetched     = false;
  this.infos       = {};
  this.usersById   = {};
  this.usersByNick = {};
};

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
        //console.log('fetched flow infos', infos);
      } catch (err) {
        console.log(err);
      }
    });
};

/**
 * Test if this provider supports the given feature.
 *
 * @param {String} feature
 * @return {Boolean}
 */
FlowProvider.prototype.has = function(feature) {
  return feature.indexOf('$user') === 0
      || feature.indexOf('$flow') === 0
      || feature.indexOf('$self') === 0;
};


FlowProvider.prototype.get = function(component, arg) {
  switch (component) {
    case '$user':
    case '$self':
      return this.usersById[arg];

    case 'flow':
      return this.infos;

    default:
      break;
  }

  return false;
};

FlowProvider.prototype.generateHandler = function(token) {

  if (token.indexOf('$user') === 0 || token.indexOf('$self') === 0) {
    return function(token) {
      var user = this.getUserById(token);
      if (!user) {
        return token;
      }

      return objectAccess(token);
    }
  }
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