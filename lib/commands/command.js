var _     = require('underscore'),
  util    = require('util'),
  Emitter = require('events').EventEmitter;


/**
 * Base command class.
 *
 * @param config
 * @constructor
 */
var Command = function(config) {

  Emitter.call(this);

  this.name       = config.name;                // name of the command
  this.origin     = config.origin;              // original string used to generate the command
  this.matcher    = new RegExp(config.matcher); // regular expression used to match the command
  this.paramsMap  = config.paramsMap;           // map regular expression matches to keys
  this.action     = config.action;
  this.author     = config.author || 'bot';     // author of the command
  this.processors = config.processors || [];
  this.help       = config.help || false;       // help for the command
  this.tags       = config.tags || [];
  this.native     = !!config.native;
  this.visible    = !!config.visible;
};

util.inherits(Command, Emitter);

/**
 * Check if a command has an available help.
 *
 * @return {Boolean}
 */
Command.prototype.hasHelp = function() {
  return !!this.help;
};


/**
 * Check if a command is a native one.
 *
 * @return {Boolean}
 */
Command.prototype.isNative = function() {
  return !!this.native;
};


/**
 * Check if a command is visible (for the command list).
 *
 * @return {Boolean}
 */
Command.prototype.isVisible = function() {
  return !!this.visible;
};


/**
 * Returns the command author name.
 *
 * @return {*}
 */
Command.prototype.getAuthor = function() {
  return this.author;
};


/**
 * Try to execute the command.
 *
 * @param message
 * @return {*}
 */
Command.prototype.exec = function(message) {

  var self     = this,
    matches    = this.matcher.exec(message.content),
    translated = {},
    processedMessage;

  if (!matches) {
    return false;
  }

  matches.shift();
  _.each(matches, function(match, i) {
    translated[self.paramsMap[i]] = match;
  });

  processedMessage = {
    'message': this.action,
    'tags':    this.tags
  };
  _.each(this.processors, function(processor) {
    processedMessage.message = processedMessage.message.replace(
      processor.placeholder,
      processor.handle(message, translated)
    );
  });

  _.each(translated, function(value, key) {
    processedMessage.message = processedMessage.message.replace(key, value);
  });

  return processedMessage;
};


module.exports = Command;