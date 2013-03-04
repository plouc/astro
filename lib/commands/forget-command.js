var _       = require('underscore')
  , Command = require('./command');
_.str       = require('underscore.string');



/**
 * Return a command used to forget one or all (non native) command(s)
 *
 * @param cmds
 * @param nativeCmds
 * @return {*}
 */
module.exports.forget = function(botName, cmds, nativeCmds) {
  return new Command({
    name:    'forget',
    help:    '\tforget one|all (non native) command(s) depending on given arg\n' +
             '\t\'forget\' remove all, \'forget custom\' remove the command named \'custom\'',
    orig:    'forget {cmd}',
    matcher: '^forget\\s?(.*)?$',
    map:     ['cmd'],
    native:  true,
    handler: function(params) {

      var toDelete = [];

      if (params.cmd !== undefined) {
        if (_.indexOf(nativeCmds, params.cmd) !== -1) {
          return '> error: \'' + params.cmd + '\' is a native command and can not be forgotten';
        }

        var deleted = false;
        cmds.forEach(function(cmd, i) {
          if (cmd.alias === params.cmd) {
            toDelete = i;
            deleted = true;
          }
        });

        if (deleted) {
          delete(cmds[toDelete]);
        }

        if (deleted) {
          return '\t> ' + botName + ' forgotten command \'' + params.cmd + '\'';
        } else {
          return '\t> error: command \'' + params.cmd + '\' not found';
        }
      }

      cmds.forEach(function(cmd, i) {
        if (_.indexOf(nativeCmds, cmd.alias) === -1) {
          toDelete.push(i);
        }
      });

      toDelete.sort();
      var offset = 0;
      console.log('TODELETE', toDelete);
      _.each(toDelete, function(i) {
        delete cmds[i - offset];
        offset++;
      });

      return '\t> ' + botName + ' forgotten all (non native) commands';
    }
  });
};

