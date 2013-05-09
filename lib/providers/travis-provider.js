var _     = require('underscore'),
  Q       = require('q'),
  request = require('request');

request.debug = true;

function TravisProvider(config) {
  this.config = config;

  this.baseUri       = 'https://api.travis-ci.org';
  this.buildUri      = this.baseUri + '/builds/%build_id%';
  this.repoUri       = this.baseUri + '/repos?owner_name=%user%';
  this.repoBuildsUri = this.baseUri + '/repos/%user%/%repository%/builds'
  this.logsUri       = this.baseUri + '/logs/%id%'
}


/**
 * @param buildId
 */
TravisProvider.prototype.getBuild = function(buildId) {
  var deferred = Q.defer();
  request({
    method: 'GET',
    uri:    this.buildUri.replace('%build_id%', buildId),
    headers: {
    }
  }, function (error, response, body) {
      if (response.statusCode === 200) {
        var applications = JSON.parse(body);
        deferred.resolve(applications);
      } else {
        deferred.reject(new Error(error));
      }
  });

  return deferred.promise;
};


/**
 * @param user
 */
TravisProvider.prototype.getUserRepositories = function(user) {
  var deferred = Q.defer();
  request({
    method: 'GET',
    uri:    this.repoUri.replace('%user%', user),
    headers: {
    }
  }, function (error, response, body) {
      if (response.statusCode === 200) {
        var repositories = JSON.parse(body);
        console.log(repositories);
        deferred.resolve(repositories);
      } else {
        deferred.reject(new Error(error));
      }
  });

  return deferred.promise;
};


TravisProvider.prototype.getRepositoryBuilds = function(user, repositoryName) {
  var deferred = Q.defer();
  request({
    method: 'GET',
    uri:    this.repoBuildsUri.replace('%user%', user)
                              .replace('%repository%', repositoryName),
    headers: {
    }
  }, function (error, response, body) {
      if (response.statusCode === 200) {
        var builds = JSON.parse(body);
        console.log(builds);
        deferred.resolve(builds);
      } else {
        deferred.reject(new Error(error));
      }
  });

  return deferred.promise;
};


module.exports = TravisProvider;


