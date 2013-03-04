var _         = require('underscore'),
  helpBuilder = require('./help-builder'),
  Command     = require('./command');
_.str         = require('underscore.string');


/**
 * HumCommand class.
 *
 * Display an image according to given type.
 *
 * @constructor
 */
function HumCommand(botName) {

  var self = this;

  var types = {
    'jira':      'http://i.imgur.com/Zjwo4.gif',
    'shame':     'http://i.imgur.com/GVDjO.gif',
    'flag':      'http://i.imgur.com/oN1Er.gif',
    'crazy':     'http://i188.photobucket.com/albums/z284/oblongman7/Scrubs/b6488ee3.gif',
    'notme':     'http://i.imgur.com/V9MavVa.gif',
    'desperate': 'http://media.tumblr.com/tumblr_lsdhbmlL611qhjgo1.gif',
    'waiting':   'http://i.imgur.com/aJaBc.gif',
    'success':   'http://i.imgur.com/AKtqu.gif'
  };

  Command.call(this, {
    'name':       'hum',
    'matcher':    '^hum\\s(' + Object.keys(types).join('|') + ')$',
    'action':     '$gif',
    'native':     'true',
    'help':       helpBuilder.build('hum', botName,
                    '\tDisplay a gif according to given situation.\n'
                  + '\tavailable situations: ' + Object.keys(types).join(', ')
                  + '\t➜ hum crazy'),
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

HumCommand.prototype = Object.create(Command.prototype);


module.exports = HumCommand;