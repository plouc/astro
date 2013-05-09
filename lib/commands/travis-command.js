var _         = require('underscore'),
  helpBuilder = require('./help-builder'),
  Q           = require('q'),
  Command     = require('./command');
_.str         = require('underscore.string');


function TravisCommand(provider, botName) {
  this.provider = provider;

  this.name    = 'travis';
  this.matcher = /^travis:(repos|builds)(\s[a-zA-Z0-9-_]+)?(\s[a-zA-Z0-9-_]+)?/g;

  this.native  = true;
  this.visible = true;
  this.author  = botName;

  this.help = helpBuilder.build('travis', botName,
              '\tfetch infos from travis ci\n'
            + '\tlist repository for the given user:\n'
            + '\t➜ travis:repos <user>\n'
            + '\tlist builds for the given user repository:\n'
            + '\t➜ travis:builds <user> <repository>\n');
}
TravisCommand.prototype = Object.create(Command.prototype);


TravisCommand.prototype.exec = function(message) {
  var messageContent = message.content,
    matches          = this.matcher.exec(messageContent);

  console.log('>>> TRAVIS MATCHES', matches);

  if (matches === null) {
    return false;
  }

  var action = matches[1];

  var deferred = Q.defer();
  if (action == 'repos') {
    if (matches[2] === undefined) {
      deferred.reject({
        'message': 'missing owner argument'
      });
    } else {
      this.provider.getUserRepositories(matches[2].trim())
      .then(function(repositories) {
        var message;
        if (repositories.length === 0) {
          message = '\tno repository found.';
        } else {
          message = 'Available repositories for ' + matches[2].trim() + ':\n';
          var reposInfo = [];
          _.each(repositories, function(repository) {

            var repoName = repository.slug.substr(repository.slug.indexOf('/') + 1);

            reposInfo.push('\t• ' + repoName + ' ➜ ' + repository.description
                         + ' ➜ last build ' + (repository.last_build_status === 0 ? 'OK ✔' : 'KO ✘'));
          });
          message += reposInfo.join('\n');
        }
        deferred.resolve({
          'message': message,
          'tags':    ['ci']
        });
      }, function() {
        deferred.reject({'message': 'failed to retrieve servers'});
      });
    }


  } else if (action == 'builds') {
    if (matches[2] === undefined || matches[3] === undefined) {
      deferred.reject({
        'message': 'missing owner argument'
      });
    } else {
      this.provider.getRepositoryBuilds(matches[2].trim(), matches[3].trim())
      .then(function(builds) {
        var message;
        if (builds.length === 0) {
          message = '\tno build found.';
        } else {
          message = 'Latest builds for ' + matches[2].trim() + '\'s ' + matches[3].trim() + ' repository:\n';
          var buildsInfo = [];
          _.each(builds, function(build, i) {
            if (i < 5) {
              buildsInfo.push('\t• ' + build.number + ' (' + build.id + ') ' + build.started_at + ' ~ ' + build.finished_at
                            + ' ' + (build.result === 0 ? 'OK ✔' : 'KO ✘') + '\n'
                            + '\t  ' + build.commit.substr(0, 10) + ': ' + build.message.replace(/\n/g, '\n\t  '));
            }
          });
          message += buildsInfo.join('\n');
        }
        deferred.resolve({
          'message': message,
          'tags':    ['ci']
        });
      }, function() {
        deferred.reject({'message': 'failed to retrieve builds'});
      });
    }
  }

  return deferred.promise;
};


module.exports = TravisCommand;