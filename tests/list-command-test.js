var vows       = require('vows'),
  Command      = require('../lib/commands/command'),
  CommandChain = require('../lib/commands/command-chain'),
  ListCommand  = require('../lib/commands/list-command'),
  assert       = require('assert');

vows.describe('ListCommand')
  .addBatch({


    'A ListCommand': {
      'topic': function() {
        return new ListCommand(new CommandChain(), 'tester-bot');
      },


      'when constructed': {
        'has \'list-cmd\' as name': function (listCommand) {
          assert.equal(listCommand.name, 'list-cmd');
        },
        'is native': function (listCommand) {
          assert.equal(listCommand.isNative(), true);
        },
        'is visible': function (listCommand) {
          assert.equal(listCommand.isVisible(), true);
        },
        'has \'bot\' as author': function (listCommand) {
          assert.equal(listCommand.getAuthor(), 'bot');
        },
        'has help defined': function(listCommand) {
          var expectHelp = '\tlist help                                                     author: tester-bot\n'
                         + '\t--------------------------------------------------------------------------------\n'
                         + '\tlist tester-bot available commands\n'
                         + '\tusage:\n'
                         + '\t> list-cmd';

          assert.equal(listCommand.hasHelp(), true);
          assert.equal(listCommand.help, expectHelp);
        }
      },


      'when executed': {
        'topic': function(listCommand) {

          return listCommand;
        },
        'return a string containing all the commands': function(listCommand) {
          var out = listCommand.exec({'content': 'list-cmd'});
          assert.equal(out.message, '\ttester-bot available commands:\n'
                                  + '\t------------------------------------------------------------------------------');
        },


        'when adding a visible command \'test1\'': {
          'topic': function(listCommand) {
            listCommand.commandChain.add(new Command({
              'name':    'test1',
              'visible': true
            }));

            return listCommand;
          },
          'display this command in the list': function(listCommand) {
            var out = listCommand.exec({'content': 'list-cmd'});
            var expectList = '\ttester-bot available commands:\n'
                           + '\t------------------------------------------------------------------------------\n'
                           + '\t* test1............... (bot)';

            assert.equal(out.message, expectList);
          }
        },


        'when adding a non visible command \'test2\'': {
          'topic': function(listCommand) {
            listCommand.commandChain.add(new Command({
              'name':    'test2',
              'visible': false
            }));

            return listCommand;
          },
          'does not add this command to the list': function(listCommand) {
            var out = listCommand.exec({'content': 'list-cmd'});
            var expectList = '\ttester-bot available commands:\n'
                           + '\t------------------------------------------------------------------------------\n'
                           + '\t* test1............... (bot)';

            assert.equal(out.message, expectList);
          }
        }
      }
    }
  })
  .export(module)
;