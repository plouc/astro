var _         = require('underscore'),
  helpBuilder = require('./help-builder'),
  Command     = require('./command');
_.str         = require('underscore.string');


/**
 * ListCommand class.
 *
 * list all available and visible commands.
 *
 * @param commandChain
 * @param botName
 * @constructor
 */
function ListCommand(commandChain, botName) {

  var self = this;

  this.commandChain = commandChain;
  this.padding      = 20;

  Command.call(this, {
    'name':       'list-cmd',
    'origin':     'list-cmd',

    'directive':  'cmd-list',
    'matcher':    '^list-cmd$',

    'rawAction':  'list',
    'action':     'list',

    'map':        ['cmd'],
    'native':     'true',
    'help':       helpBuilder.build('list', botName,
                    '\tlist ' + botName + ' available commands\n'
                  + '\tusage:\n'
                  + '\t> list-cmd'),
    'visible':    true,
    'processors': [{
      'placeholder': 'list',
      'handle':      function (message) {
        var list = '\t' + botName + ' available commands:\n'
                 + '\t------------------------------------------------------------------------------';
        self.commandChain.commands.forEach(function(command) {
          if (command.isVisible()) {
            list += '\n\t* ' + _.str.rpad(command.name, self.padding, '.') + ' (' + command.author + ')';
          }
        });

        return list;
      }
    }]
  });
}

ListCommand.prototype = Object.create(Command.prototype);


module.exports = ListCommand;