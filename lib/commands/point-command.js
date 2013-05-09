var _         = require('underscore'),
  helpBuilder = require('./help-builder'),
  Command     = require('./command');
_.str         = require('underscore.string');


/**
 * PointCommand class.
 *
 * @constructor
 */
function PointCommand(botName, providerCollection) {

  var flowProvider = providerCollection.get('flow');

  Command.call(this, {
    'name':         'pt',
    'matcher':      '^pt\\s([^\\s]+)\\s([^\\s]+)$',
    'paramsMap':    ['$type', '$nick'],
    'action':       '$point',
    'native':       true,
    'author':       botName,
    'visible':      true,
    'help':         helpBuilder.build('pt', botName,
                      '\tgive a type point to the given user\n'
                    + '\tusage:\n'
                    + '\t➜ pt humor john'),
    'processors':   [{
      'placeholder': '$point',
      'handle': function(message, translated) {
        console.log('TRANSLATED >>>', translated);

        var pointMsg = '1 ' + translated['$type'] + ' point for ',
          user       = flowProvider.getUserByNick(translated['$nick']),
          avatar     = '',
          width;

        if (user) {
          avatar = user.avatar + '\n';
          pointMsg += '@' + user.nick;
          width = pointMsg.length + 2;
        } else {
          pointMsg += translated['$nick'];
          width = pointMsg.length + 2;
        }

        return avatar
             + '\t+' + _.str.repeat('-', width) + '+\n'
             + '\t| ' + pointMsg + ' |\n'
             + '\t+' + _.str.repeat('-', width) + '+\n';
      }
    }]
  });
}

PointCommand.prototype = Object.create(Command.prototype);

module.exports = PointCommand;