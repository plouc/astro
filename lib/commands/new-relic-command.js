var _         = require('underscore'),
  helpBuilder = require('./help-builder'),
  Q           = require('q'),
  Command     = require('./command');
_.str         = require('underscore.string');


function NewRelicCommand(provider, botName) {
  this.provider = provider;

  this.name    = 'relic';
  this.matcher = /^relic:(servers)(\s[a-z0-9-]+)?/g;

  this.native  = true;
  this.visible = true;
  this.author  = botName;

  this.help = helpBuilder.build('relic', botName,
              '\tfetch new relic infos\n'
            + '\tlist available servers for given environment:\n'
            + '\t➜ relic:servers <environment>');
}
NewRelicCommand.prototype = Object.create(Command.prototype);


NewRelicCommand.prototype.exec = function(message) {
  var messageContent = message.content,
    matches          = this.matcher.exec(messageContent);

  console.log('>>> MATCHES', matches);

  if (matches === null) {
    return false;
  }

  var action = matches[1];


  var deferred = Q.defer();
  if (action == 'servers') {
    if (matches[2] === undefined) {
      deferred.reject({
        'message': 'missing account argument'
      });
    } else {
      this.provider.getServers(matches[2].trim())
      .then(function(servers) {
        var serverNames = _.pluck(servers, 'hostname'),
          message;

        if (serverNames.length === 0) {
          message = '\tno server found';
        } else {
          message = '\t• ' + serverNames.join('\n\t• ');
        }

        deferred.resolve({'message': message});
      }, function() {
        deferred.reject('failed to retrieve servers');
      });
    }
  }

  return deferred.promise;
};


module.exports = NewRelicCommand;