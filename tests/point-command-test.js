var vows       = require('vows'),
  Command      = require('../lib/commands/command'),
  CommandChain = require('../lib/commands/command-chain'),
  PointCommand = require('../lib/commands/point-command'),
  assert       = require('assert');

vows.describe('PointCommand')
  .addBatch({


    'A PointCommand': {
      'topic': function() {
        return new PointCommand();
      },


      'when constructed': {
        'has \'list-cmd\' as name': function (pointCommand) {
          assert.equal(pointCommand.name, 'pt');
        },
        'is native': function (pointCommand) {
          assert.equal(pointCommand.isNative(), true);
        },
        'is visible': function (pointCommand) {
          assert.equal(pointCommand.isVisible(), true);
        },
        'has \'bot\' as author': function (pointCommand) {
          assert.equal(pointCommand.getAuthor(), 'bot');
        },
        'has help defined': function(pointCommand) {
          assert.equal(pointCommand.hasHelp(), true);
          assert.equal(pointCommand.help,
                       '\t give a type point to the given user\n'
                     + '\t usage:\n'
                     + '\t > pt humor john');
        }
      }
    }
  })
  .export(module)
;