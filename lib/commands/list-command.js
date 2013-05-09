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
  this.width      = 80;

  Command.call(this, {
    'name':       'list-cmd',
    'author':     botName,
    'origin':     'list-cmd',
    'directive':  'cmd-list',
    'matcher':    '^list-cmd$',
    'rawAction':  'list',
    'action':     'list',
    'native':     'true',
    'help':       helpBuilder.build('list', botName,
                    '\tlist ' + botName + ' available commands\n'
                  + '\tusage:\n'
                  + '\t➜ list-cmd'),
    'visible':    true,
    'processors': [{
      'placeholder': 'list',
      'handle':      function (message) {
        var list = '\t' + botName + ' available commands\n'
                 + '\t' + _.str.repeat('—', self.width);
        self.commandChain.items.forEach(function(command) {
          if (command.isVisible()) {
            var fillWidth = self.width - (command.name.length + command.author.length + 4);
            list += '\n\t• ' + command.name + ' ' + _.str.repeat('.', fillWidth)  + ' ' + command.author;
          }
        });

        return list;
      }
    }]
  });
}

ListCommand.prototype = Object.create(Command.prototype);


module.exports = ListCommand;