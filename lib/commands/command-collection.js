var _        = require('underscore'),
  Collection = require('../collection'),
  Command    = require('./command');


/**
 * CommandCollection class.
 *
 * @constructor
 */
var CommandCollection = function() {
  Collection.call(this);
};

CommandCollection.prototype = Object.create(Collection.prototype);


/**
 * Add a command to the stack.
 *
 * @param {Command} command
 * @return {CommandCollection}
 */
CommandCollection.prototype.add = function(command) {

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
    this.items.push(helpCommand);
    this.namedItems[helpCommand.name] = helpCommand;
  }

  this.items.push(command);
  this.namedItems[command.name] = command;

  return this;
};


/**
 * Try to execute all registered commands.
 *
 * @param message
 * @return {Boolean}
 */
CommandCollection.prototype.exec = function(message) {
  var processedMessage = false;
  _.each(this.items, function(command) {
    if (!processedMessage) {
      processedMessage = command.exec(message);
    }
  });

  return processedMessage;
};


module.exports = CommandCollection;