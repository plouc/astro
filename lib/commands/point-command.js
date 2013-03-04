var _       = require('underscore')
  , Command = require('./command');
_.str       = require('underscore.string');


/**
 * PointCommand class.
 *
 * @constructor
 */
function PointCommand() {
  Command.call(this, {
    'name':         'pt',
    'orig':         'teach pt $type $user do 1 point $type pour $user',

    'directive':    'pt $type $user',
    'matcher':      '^pt ([a-zA-Z0-9]+) ([a-zA-Z0-9]+)$',

    'rawAction':    '1 point $type pour $user',
    'action':       '1 point $type pour $user',

    'author':       'bot',
    'native':       true,
    'visible':      true,
    'help':         '\t give a type point to the given user\n'
                  + '\t usage:\n'
                  + '\t > pt humor john',
    'processors':   [
      {
        'placeholder': '$user',
        'handle': function() {
          console.log('\nHANDLE\n');
        }
      }
    ],
    'translations': ['$type', '$user']
  });
}

/*
var pointMsg = '1 point ' + params.type + ' for '
  , avatar   = ''
  , width
  , message;

  if (_.isObject(params.user)) {
    avatar = params.user.avatar + '\n';
    pointMsg += '@' + params.user.nick;
    width = pointMsg.length + 4;
  } else {
    pointMsg += params.user;
    width = pointMsg.length + 2;
  }

  message = avatar
          + '\t+' + _.str.repeat('-', width) + '+\n'
          + '\t| ' + pointMsg + ' |\n'
          + '\t+' + _.str.repeat('-', width) + '+\n';

return message;
*/


PointCommand.prototype = Object.create(Command.prototype);


module.exports = PointCommand;