var _     = require('underscore'),
  Q       = require('q'),
  request = require('request');


function NewRelicProvider(config) {
  this.config = config;

  this.serversUri        = 'https://api.newrelic.com/api/v1/accounts/%account_id%/servers.json';
  this.applicationsUri   = 'https://api.newrelic.com/api/v1/accounts/%account_id%/applications.json';
  this.metricsSummaryUri = 'https://api.newrelic.com/api/v1/applications/%application_id%/metrics.json';
  // End User Apdex Metric Per Hour
  this.eamPerHourUri     = 'https://api.newrelic.com/api/v1/accounts/%account_id%/applications/%application_id%/data.json?'
                         + 'metrics[]=WebTransaction&field=max_call_time&filed=name&begin=2011-12-15T00:00:00Z&end=2013-12-16T00:00:00Z';

  /*
  this.transactionsUri   = 'https://api.newrelic.com/api/v1/accounts/%account_id%/applications/%application_id%/data.json?'
                         + 'metrics[]=EndUser/Apdex&field=score&begin=2011-12-15T00:00:00Z&end=2011-12-16T00:00:00Z';
  */
}


/**
 * Try to get a configuration object for the given account.
 *
 * @param account
 * @return {*}
 */
NewRelicProvider.prototype.getAccountConfig = function(account) {
  if (!this.config.hasOwnProperty(account)) {
    throw 'Invalid account \'' + account + '\'';
  }

  return this.config[account];
};


/**
 * Returns available servers for given account.
 *
 * @param account
 */
NewRelicProvider.prototype.getServers = function(account) {
  var accountConfig = this.getAccountConfig(account);

  var deferred = Q.defer();
  request({
    method: 'GET',
    uri:    this.serversUri.replace('%account_id%', accountConfig.id),
    headers: {
      'x-api-key': accountConfig.key
    }
  }, function (error, response, body) {
    if (error) {
      deferred.reject(new Error(error));
    } else {
      deferred.resolve(JSON.parse(body));
    }
  });

  return deferred.promise;
};


/**
 * Returns available servers for given account.
 *
 * @param account
 */
NewRelicProvider.prototype.getEndUserApdex = function(account, application) {
  var accountConfig = this.getAccountConfig(account);

  if (!accountConfig.applications.hasOwnProperty(application)) {
    throw 'Invalid application \'' + application + '\'';
  }

  var deferred = Q.defer();
  request({
    method: 'GET',
    uri:    this.eamPerHourUri.replace('%account_id%', accountConfig.id)
                              .replace('%application_id%', accountConfig.applications[application]),
    headers: {
      'x-api-key': accountConfig.key
    }
  }, function (error, response, body) {
    if (error) {
      deferred.reject(new Error(error));
    } else {
      deferred.resolve(JSON.parse(body));
    }
  });

  return deferred.promise;
};



/**
 * Returns available applications for given account.
 *
 * @param account
 */
NewRelicProvider.prototype.getApplications = function(account) {
  var accountConfig = this.getAccountConfig(account);

  request({
    method: 'GET',
    uri:    this.applicationsUri.replace('%account_id%', accountConfig.id),
    headers: {
      'x-api-key': accountConfig.key
    }
  }, function (error, response, body) {
    var applications = JSON.parse(body);
    console.log(applications);
  }
  );
};


/**
 * Returns available metrics for given account application.
 *
 * @param account
 */
NewRelicProvider.prototype.getAvailableMetrics = function(account, application) {
  var accountConfig = this.getAccountConfig(account);

  if (!accountConfig.applications.hasOwnProperty(application)) {
    throw 'Invalid application \'' + application + '\'';
  }

  var deferred = Q.defer();
  request({
    method: 'GET',
    uri:    this.metricsSummaryUri.replace('%application_id%', accountConfig.applications[application]),
    headers: {
      'x-api-key': accountConfig.key
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


module.exports = NewRelicProvider;


