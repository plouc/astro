var vows        = require('vows'),
  TravisCommand = require('../lib/commands/travis-command'),
  assert        = require('assert');

vows.describe('PointCommand')
  .addBatch({


    'A TravisCommand': {
      'topic': function() {
        return new TravisCommand({}, 'tester-bot');
      },


      'when constructed': {
        'has \'travis\' as name': function (travisCommand) {
          assert.equal(travisCommand.name, 'travis');
        },
        'is native': function (travisCommand) {
          assert.equal(travisCommand.isNative(), true);
        },
        'is visible': function (travisCommand) {
          assert.equal(travisCommand.isVisible(), true);
        },
        'has \'tester-bot\' as author': function (travisCommand) {
          assert.equal(travisCommand.getAuthor(), 'tester-bot');
        },
        'has help defined': function(pointCommand) {
          var expectHelp = '\ttravis help                                                   author: tester-bot\n'
                         + '\t————————————————————————————————————————————————————————————————————————————————\n'
                         + '\tfetch infos from travis ci\n'
                         + '\tlist repository for the given user:\n'
                         + '\t➜ travis:repos <user>\n'
                         + '\tlist builds for the given user repository:\n'
                         + '\t➜ travis:builds <user> <repository>\n'

          assert.equal(pointCommand.hasHelp(), true);
          assert.equal(pointCommand.help, expectHelp);
        }
      }
    }
  })
  .export(module)
;