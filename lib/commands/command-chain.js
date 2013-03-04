var _     = require('underscore'),
  Command = require('./command');


/**
 * CommandChain class.
 *
 * @constructor
 */
var CommandChain = function() {
  this.commands = [];
};


/**
 * Add a command to the stack.
 *
 * @param {Command} command
 * @return {CommandChain}
 */
CommandChain.prototype.add = function(command) {
  if ((command instanceof Command) === false) {
    throw 'Command must be an instance of Command';
  }

  if (command.hasHelp()) {
    var helpCommand = new Command({
      'name':       command.name + '-help',

      'directive':  'help',
      'matcher':    '^' + command.name + '\\shelp$',

      'rawAction':  'help',
      'action':     'help',

      'visible':    false,
      'processors': [{
        'placeholder': 'help',
        'handle':      function () {
          return command.help;
        }
      }]
    });

    // push the help command first,
    // prevent the original command to be matched
    // before the help one is reached
    this.commands.push(helpCommand);
  }

  this.commands.push(command);

  return this;
};


/**
 * Get a command by its name.
 *
 * @param commandName
 * @return {Boolean|Command}
 */
CommandChain.prototype.get = function(commandName) {
  var foundCommand = false;
  _.each(this.commands, function(command) {
    if (command.name === commandName) {
      foundCommand = command;
    }
  });

  return foundCommand;
};


/**
 * Try to execute all registered commands.
 *
 * @param message
 * @return {Boolean}
 */
CommandChain.prototype.exec = function(message) {
  var processedMessage = false;
  _.each(this.commands, function(command) {
    if (!processedMessage) {
      processedMessage = command.exec(message);
    }
  });

  return processedMessage;
};


module.exports = CommandChain;