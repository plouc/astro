var vows          = require('vows'),
  ReminderCommand = require('../lib/commands/reminder-command'),
  assert          = require('assert');

var ProviderCollection = function() {};
ProviderCollection.prototype.get = function() {
  return {};
};


vows.describe('ReminderCommand')
  .addBatch({

    'A ReminderCommand': {
      'topic': function() {
        return new ReminderCommand('tester-bot', new ProviderCollection());
      },


      'when constructed': {
        'has \'reminder\' as name': function (reminderCommand) {
          assert.equal(reminderCommand.name, 'reminder');
        },
        'is native': function (reminderCommand) {
          assert.equal(reminderCommand.isNative(), true);
        },
        'is visible': function (reminderCommand) {
          assert.equal(reminderCommand.isVisible(), true);
        },
        'has \'tester-bot\' as author': function (reminderCommand) {
          assert.equal(reminderCommand.getAuthor(), 'tester-bot');
        },
        'has help defined': function(reminderCommand) {
          assert.equal(reminderCommand.hasHelp(), true);
          assert.equal(reminderCommand.help,
                       '\treminder help                                                 author: tester-bot\n'
                     + '\t————————————————————————————————————————————————————————————————————————————————\n'
                     + '\tReminder\n'
                     + '\tusage:\n'
                     + '\t➜ in 5mn take a coffee\n'
                     + '\t➜ in 1d take make a nodejs bot');
        }
      },

      'when executed': {
        'topic': function(reminderCommand) {

          return reminderCommand;
        },
        'with \'in 5mn take a coffee\' will set a reminder in 5 minutes': function(reminderCommand) {
          var out = reminderCommand.exec({'content': 'in 5mn take a coffee'});
          assert.equal(out.message, '\tgot it! "take a coffee" reminder set (in 5 minutes)');
        },
        'with \'in 5 mn take a coffee\' will set a reminder in 5 minutes': function(reminderCommand) {
          var out = reminderCommand.exec({'content': 'in 5 mn take a coffee'});
          assert.equal(out.message, '\tgot it! "take a coffee" reminder set (in 5 minutes)');
        },
        'with \'in 1minute take a coffee\' will set a reminder in 1 minute': function(reminderCommand) {
          var out = reminderCommand.exec({'content': 'in 1minute take a coffee'});
          assert.equal(out.message, '\tgot it! "take a coffee" reminder set (in 1 minute)');
        },
        'with \'in 1 minute take a coffee\' will set a reminder in 1 minute': function(reminderCommand) {
          var out = reminderCommand.exec({'content': 'in 1 minute take a coffee'});
          assert.equal(out.message, '\tgot it! "take a coffee" reminder set (in 1 minute)');
        },
        'with \'in 3minutes take a coffee\' will set a reminder in 3 minutes': function(reminderCommand) {
          var out = reminderCommand.exec({'content': 'in 3minutes take a coffee'});
          assert.equal(out.message, '\tgot it! "take a coffee" reminder set (in 3 minutes)');
        },
        'with \'in 3 minutes take a coffee\' will set a reminder in 3 minutes': function(reminderCommand) {
          var out = reminderCommand.exec({'content': 'in 3 minutes take a coffee'});
          assert.equal(out.message, '\tgot it! "take a coffee" reminder set (in 3 minutes)');
        },
        'with \'in 2d take two coffees\' will set a reminder in 2 days': function(reminderCommand) {
          var out = reminderCommand.exec({'content': 'in 2d take two coffees'});
          assert.equal(out.message, '\tgot it! "take two coffees" reminder set (in 2 days)');
        }
      }
    }
  })
  .export(module)
;