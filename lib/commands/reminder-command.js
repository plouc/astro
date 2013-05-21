var _         = require('underscore'),
  helpBuilder = require('./help-builder'),
  Command     = require('./command'),
  util        = require('util');
_.str         = require('underscore.string');


/**
 * PointCommand class.
 *
 * @constructor
 */
function ReminderCommand(botName, providerCollection) {

  var flowProvider = providerCollection.get('flow');

  var unitMapping = {
    'second': {
      'seconds': 1,
      'abbr':    's',
      'plural':  'seconds'
    },
    'minute': {
      'seconds': 60,
      'abbr':    'mn',
      'plural':  'minutes'
    },
    'hour': {
      'seconds': 60 * 60,
      'abbr':    'h',
      'plural':  'hours'
    },
    'day': {
      'seconds': 60 * 60 * 24,
      'abbr':    'd',
      'plural':  'days'
    },
    'month': {
      'seconds': 60 * 60 * 24 * 30,
      'abbr':    'm',
      'plural':  'months'
    },
    'year': {
      'seconds': 60 * 60 * 24 * 30 * 12,
      'abbr':    'y',
      'plural':  'years'
    }
  };

  var normalizeUnit = function(unit) {
    var normalizedUnit = null;

    _.each(unitMapping, function(config, unitKey) {
      if (unit == unitKey || unit == config.abbr || unit == config.plural) {
        normalizedUnit = unitKey;
      }
    });

    return normalizedUnit;
  };

  var pluralizeUnit = function(time, unit) {

    return time > 1 ? unitMapping[unit]['plural'] : unit;
  };

  var self = this;

  Command.call(this, {
    'name':         'reminder',
    'matcher':      '^in\\s([0-9]+)\\s?(s|second|seconds|mn|minute|minutes|h|hour|hours|d|day|days|m|month|months|y|year|years)\\s(.*)$',
    'paramsMap':    ['$time', '$unit', '$reminder'],
    'action':       '$reminder',
    'native':       true,
    'author':       botName,
    'visible':      true,
    'help':         helpBuilder.build('reminder', botName,
                      '\tReminder\n'
                    + '\tusage:\n'
                    + '\t➜ in 5mn take a coffee\n'
                    + '\t➜ in 1d take make a nodejs bot'),
    'processors':   [{
      'placeholder': '$reminder',
      'handle': function(message, translated) {
        var normalizedUnit = normalizeUnit(translated['$unit']);

        setTimeout(function() {
          console.log('FINALLY >>>>', translated['$reminder']);
        }, unitMapping[normalizedUnit]['seconds'] * translated['$time']);


        var message = '\tgot it! "' + translated['$reminder'] + '"'
                    + ' reminder set '
                    + '(in ' + translated['$time'] + ' ' + pluralizeUnit(translated['$time'], normalizedUnit) + ')';

        self.emit('message', message);

        return message;
      }
    }]
  });
}

util.inherits(ReminderCommand, Command);

module.exports = ReminderCommand;