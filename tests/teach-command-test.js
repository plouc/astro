var vows             = require('vows'),
  assert             = require('assert'),
  ProviderCollection = require('../lib/providers/provider-collection'),
  CommandCollection  = require('../lib/commands/command-collection'),
  TeachCommand       = require('../lib/commands/teach-command');

var FlowProviderMock = function() {
  this.name = 'flow';
};
FlowProviderMock.prototype.support = function(feature) {
  return feature == 'self' || feature == 'user';
};
FlowProviderMock.prototype.getUserById = function(userId) {
  return {
    'nick': 'test nick',
    'name': 'test name'
  }
};

vows.describe('TeachCommand')
  .addBatch({


    'A TeachCommand': {
      'topic': function() {
        var commands     = new CommandCollection(),
            flowProvider = new FlowProviderMock(),
            providers    = new ProviderCollection();

        providers.add(flowProvider);

        return {
          'commands': commands,
          'command':  new TeachCommand(commands, 'tester-bot', providers)
        };
      },


      'when constructed': {
        'has \'teach\' as name': function (o) {
          assert.equal(o.command.name, 'teach');
        },
        'is native': function (o) {
          assert.equal(o.command.isNative(), true);
        },
        'is visible': function (o) {
          assert.equal(o.command.isVisible(), true);
        },
        'has \'bot\' as author': function (o) {
          assert.equal(o.command.getAuthor(), 'tester-bot');
        },
        'has help defined': function(o) {
          var expectHelp = '\tteach help                                                    author: tester-bot\n'
                         + '\t————————————————————————————————————————————————————————————————————————————————\n'
                         + '\tteach a new command to tester-bot, usage:\n'
                         + '\t➜ teach <directive> do: <action> [help: <help> tags: <tags>]';

          assert.equal(o.command.hasHelp(), true);
          assert.equal(o.command.help, expectHelp);
        },


        'when executing \'teach test do: i\'m a test\'': {
          'topic': function(o) {
            o.command.exec({
              'content': 'teach test do: i\'m a test'
            });

            return o;
          },
          'create a new command and add it to the command chain': function(o) {
            assert.equal(o.commands.items.length, 1);
            assert.deepEqual(Object.keys(o.commands.namedItems), ['test']);

            var newCommand = o.commands.items[0];
            assert.equal(newCommand.name, 'test');
            assert.equal(newCommand.author, 'test nick');
            assert.equal(newCommand.matcher, '/^test$/');
          },


          'when executing \'teach testHelp do: testing help help: help for testHelp command\'': {
            'topic': function(o) {
              o.command.exec({
                'content': 'teach testHelp do: testing help help: help for testHelp command'
              });

              return o;
            },
            'create a new command and add it to the command chain': function(o) {
              assert.equal(o.commands.items.length, 3);
              assert.deepEqual(Object.keys(o.commands.namedItems), ['test', 'testHelp-help', 'testHelp']);

              var newCommand = o.commands.items[0];
              assert.equal(newCommand.name, 'test');
              assert.equal(newCommand.author, 'test nick');
              assert.equal(newCommand.matcher, '/^test$/');
            }
          }
        }
      }
    }
  })
  .export(module)
;