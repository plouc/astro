var vows       = require('vows'),
  PointCommand = require('../lib/commands/point-command'),
  assert       = require('assert');

var ProviderCollection = function() {};
ProviderCollection.prototype.get = function() {
  return {};
};


vows.describe('PointCommand')
  .addBatch({


    'A PointCommand': {
      'topic': function() {
        return new PointCommand('tester-bot', new ProviderCollection());
      },


      'when constructed': {
        'has \'pt\' as name': function (pointCommand) {
          assert.equal(pointCommand.name, 'pt');
        },
        'is native': function (pointCommand) {
          assert.equal(pointCommand.isNative(), true);
        },
        'is visible': function (pointCommand) {
          assert.equal(pointCommand.isVisible(), true);
        },
        'has \'tester-bot\' as author': function (pointCommand) {
          assert.equal(pointCommand.getAuthor(), 'tester-bot');
        },
        'has help defined': function(pointCommand) {
          assert.equal(pointCommand.hasHelp(), true);
          assert.equal(pointCommand.help,
                       '\tpt help                                                       author: tester-bot\n'
                     + '\t————————————————————————————————————————————————————————————————————————————————\n'
                     + '\tgive a type point to the given user\n'
                     + '\tusage:\n'
                     + '\t➜ pt humor john');
        }
      }
    }
  })
  .export(module)
;