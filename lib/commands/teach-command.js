var _         = require('underscore'),
  Command     = require('./command'),
  helpBuilder = require('./help-builder'),
  util        = require('../util');
_.str         = require('underscore.string');


/**
 * A command to teach the bot other commands.
 *
 * @param {commandCollection}  commandCollection
 * @param {string}             botName
 * @param {providerCollection} providerCollection
 * @constructor
 */
var TeachCommand = function(commandCollection, botName, providerCollection) {

  this.commandCollection  = commandCollection;
  this.botName            = botName;
  this.providerCollection = providerCollection;

  this.name    = 'teach';
  this.author  = this.botName;
  this.native  = true;
  this.visible = true;
  this.help    = helpBuilder.build('teach', botName,
                 '\tteach a new command to ' + botName + ', usage:\n'
               + '\t➜ teach <directive> do: <action> [help: <help> tags: <tags>]');

  /**
   * index  rule                         mapped to  desc
   *     1  ([a-z0-9-]{2,})              name       alphanumeric + '-'
   *     2  (.+)?                        directive  all before ' do: '
   *     3  ((?:(?!\stags:|\shelp:).)+)  rawAction  all not followed by ' tags:' or ' help:'
   *
   */
  this.compilePattern = /^teach\s([a-zA-Z0-9-]{2,})(.+)?\sdo:\s((?:(?!\stags:|\shelp:).)+)(\s(?:help|tags):\s(?:(?:(?!\stags:|\shelp:).)+))?(\s(?:help|tags):\s(?:(?:(?!\stags:|\shelp:).)+))?/;

  var self = this;
  this.tokenizers = [

    // inject value from providers or user input
    { 'id': 'inject', 'regexp': /\$[a-z.]+/g,
      'do': function(token, message, translations) {
        //self.providerCollection.generateHandlers(tokens);

        var user;

        if (token.indexOf('$self') === 0) {
          user = self.providerCollection.get('flow').getUserById(message.user);

          return !user ? token : util.objectAccess(user, token);
        }

        if (token.indexOf('$user') === 0 && translations.hasOwnProperty('$user')) {
          user = self.providerCollection.get('flow').getUserByNick(translations['$user']);

          return !user ? token : util.objectAccess(user, token);
        }

        return token;
      },
      'process': {} },

    // random function
    { 'id': 'rand', 'regexp': /rand\([^,]+,[^)]+\)/g,
      'pre': function(match) {
        var parts = match.substring(5, match.length - 1).split(',');

        return [parts];
      },
      'do': function(parts) {
        if (parts.length === 2 && util.isInt(parts[0]) && util.isInt(parts[1])) {
          return _.random(parts[0], parts[1]);
        }

        return parts[_.random(0, parts.length - 1)];
      },
      'process': {} }
  ];
};
TeachCommand.prototype = Object.create(Command.prototype);


/**
 * Try to execute the command from the given message object.
 *
 * @param message
 * @return {*}
 */
TeachCommand.prototype.exec = function(message) {

  var teachMatches = this.compilePattern.exec(message.content);
  if (teachMatches === null) {
    return false;
  }

  var name   = teachMatches[1].trim();
  var author = this.providerCollection.get('flow').getUserById(message.user);
      author = author ? author.nick : 'bot';

  // Exit if a command already exists in the command chain with the same name
  if (this.commandCollection.has(name)) {
    return {
      'message': '\t✘ Sorry @' + author + ', but I\'ve already learned how to handle the \'' + name + '\' command.\n'
               + '\t  please try another name for your command.'
    };
  }

  var
    directive  = teachMatches[2] === undefined ? '' : teachMatches[2],
    rawAction  = teachMatches[3],
    action     = rawAction,
    help       = '',
    tags       = [],
    processors = [],
    paramsMap  = [],
    matcher, translationsMatches;

  // extract help/tags instructions from message content
  _.each([teachMatches[4],teachMatches[5]], function(helpOrTags) {
    if (helpOrTags !== undefined) {
      helpOrTags = helpOrTags.trim();
      if (helpOrTags.indexOf('help') === 0) {
        helpOrTags = helpOrTags.substr(5).trim();
        if (helpOrTags.length > 0) {
          help = helpOrTags;
        }
      } else if (helpOrTags.indexOf('tags') === 0) {
        helpOrTags = helpOrTags.substr(5).trim();
        if (helpOrTags.length > 0) {
          tags = helpOrTags.split(',');
        }
      }
    }
  });

  // build the regexp to match the command
  directive = name + directive;
  matcher   = '^' + directive.replace(/\$[a-z0-9]+/gi, '([^\\s]+)') + '$';

  // build replacements array
  translationsMatches = directive.match(/\$[a-z0-9.]+/gi);
  _.each(translationsMatches, function(translation) {
    paramsMap.push(translation);
  });

  // search processors
  _.each(this.tokenizers, function(tokenizer) {
    var tokens = action.match(tokenizer.regexp);
    if (tokens) {
      tokens = _.uniq(tokens);
      _.each(tokens, function(token) {
        var args = [token];
        if (_.isFunction(tokenizer.pre)) {
          args = tokenizer.pre(token);
        }

        processors.push({
          'placeholder': token,
          'handle':      function (message, translations) {
            return tokenizer.do.apply(tokenizer, [].concat(args, message, translations));
          }
        });
      });
    }
  });

  if (help.length > 0) {
    help = helpBuilder.build(name, author, '\t' + help);
  }

  this.commandCollection.add(new Command({
    'name':       name,
    'matcher':    matcher,
    'action':     action,
    'paramsMap':  paramsMap,
    'origin':     message.content,
    'help':       help,
    'tags':       tags,
    'author':     author,
    'processors': processors,
    'visible':    true
  }));

  return {
    'message': '\tThank you for your contribution @' + author + ', I feel more clever now !\n'
             + '\tI\'ve learned how to handle the \'' + name + '\' command',
    'tags':    [this.botName, 'learning']
  };
};

module.exports = TeachCommand;