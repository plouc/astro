var vows       = require('vows'),
  Command      = require('../lib/commands/command'),
  CommandChain = require('../lib/commands/command-chain'),
  assert       = require('assert');


vows.describe('CommandChain')
  .addBatch({

    'A CommandChain': {
      'topic': function() {
        return new CommandChain();
      },


      'when constructed': function(commandChain) {
        assert(commandChain.commands, []);
      },


      'when a command is added': {
        'topic': function(commandChain) {
          commandChain.add(new Command({
            'name':   'foo',
            'author': 'tester',
            'help':   'foo command help'
          }));

          return commandChain;
        },
        'has added it to its stack': function(commandChain) {
          // 2 because of the generated help command
          assert.equal(commandChain.commands.length, 2);
          assert.equal(commandChain.commands[1].name, 'foo');
          assert.equal(commandChain.commands[1].author, 'tester');
        },
        'can retrieve it by its name': function(commandChain) {
          assert.isNotEmpty(commandChain.get('foo'));
        },
        'generate an help command for it': function(commandChain) {
          assert.isNotEmpty(commandChain.get('foo-help'));
        },


        'with generated help command': {
          'topic': function(commandChain) {
            return commandChain.get('foo-help');
          },
          'has a name composed of the original name + \'-help\'': function(helpCommand) {
            assert.equal(helpCommand.name, 'foo-help');
            assert.equal(helpCommand.author, 'bot');
          },
          'is not native': function(helpCommand) {
            assert.equal(helpCommand.isNative(), false);
          },
          'is not visible': function(helpCommand) {
            assert.equal(helpCommand.isVisible(), false);
          },
          'display base command help when executed': function(helpCommand) {
            var out = helpCommand.exec({'content': 'foo help'});
            assert.equal(out.message, 'foo command help');
          }
        }
      }
    }
  })
  .export(module)
;