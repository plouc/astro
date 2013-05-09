var vows            = require('vows'),
  Command           = require('../lib/commands/command'),
  CommandCollection = require('../lib/commands/command-collection'),
  assert            = require('assert');


vows.describe('CommandCollection')
  .addBatch({

    'A CommandCollection': {
      'topic': function() {
        return new CommandCollection();
      },


      'when constructed': function(commands) {
        assert(commands.items, []);
        assert(Object.keys(commands.namedItems), []);
      },


      'when a command is added': {
        'topic': function(commands) {
          commands.add(new Command({
            'name':   'foo',
            'author': 'tester',
            'help':   'foo command help'
          }));

          return commands;
        },
        'has added it to its stack with corresponding help command': function(commands) {
          // 2 because of the generated help command
          assert.equal(commands.items.length, 2);
          assert.equal(commands.items[1].name, 'foo');
          assert.equal(commands.items[1].author, 'tester');
          assert.deepEqual(Object.keys(commands.namedItems), ['foo-help', 'foo']);
        },
        'can retrieve it by its name': function(commands) {
          assert.isNotEmpty(commands.get('foo'));
        },
        'generate an help command for it': function(commands) {
          assert.isNotEmpty(commands.get('foo-help'));
        },

        'with generated help command': {
          'topic': function(commands) {
            return commands.get('foo-help');
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