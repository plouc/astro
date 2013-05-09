var _         = require('underscore'),
  helpBuilder = require('./help-builder'),
  Command     = require('./command');
_.str         = require('underscore.string');


/**
 * SoCommand class.
 *
 * Display an image according to given type.
 *
 * @constructor
 */
function SoCommand(botName) {
  var types = {
    'jira':       'http://i.imgur.com/Zjwo4.gif',
    'shame':      'http://i.imgur.com/GVDjO.gif',
    'flag':       'http://i.imgur.com/oN1Er.gif',
    'crazy':      'http://i188.photobucket.com/albums/z284/oblongman7/Scrubs/b6488ee3.gif',
    'notme':      'http://i.imgur.com/V9MavVa.gif',
    'desperate':  'http://media.tumblr.com/tumblr_lsdhbmlL611qhjgo1.gif',
    'waiting':    'http://i.imgur.com/aJaBc.gif',
    'success':    'http://i.imgur.com/AKtqu.gif',
    'dubious':    'http://i.imgur.com/qX3nQi1.gif',
    'baddone':    'http://i.imgur.com/LaOykFc.gif',
    'incredible': 'http://i.imgur.com/D26gL.gif',
    'deploy':     'http://i1.kym-cdn.com/photos/images/original/000/234/786/bf7.gif'
  };

  Command.call(this, {
    'name':       'so',
    'author':     botName,
    'matcher':    '^so\\s(' + Object.keys(types).join('|') + ')$',
    'action':     '$gif',
    'native':     'true',
    'help':       helpBuilder.build('so', botName,
                    '\tDisplay a gif according to given situation.\n'
                  + '\tavailable situations: ' + Object.keys(types).join(', ') + '\n'
                  + '\t➜ so crazy'),
    'paramsMap':  ['$type'],
    'visible':    true,
    'processors': [{
      'placeholder': '$gif',
      'handle':      function (message, translated) {
        return types[translated['$type']];
      }
    }]
  });
}

SoCommand.prototype = Object.create(Command.prototype);


module.exports = SoCommand;