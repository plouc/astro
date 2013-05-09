/*

 +-------------------------------------+
 |      SAMPLE CONFIGURATION FILE      |
 +-------------------------------------+
 |                                     |
 |   In order to run astro, you must   |
 |   copy this file to config.js       |
 |   and set your own parameters.      |
 |                                     |
 +-------------------------------------+

*/

var botName = 'astr⦿';
var welcome = '\tHi everyone, I\'m astr⦿ !\n'
            + '\tIf you want to have a look at how I\'m made or add your own improvements,\n'
            + '\tsee https://github.com/plouc/astro otherwise, say \'list-cmd\'\n'
            + '\tfor the complete list of commands.';

var config = {
  'default': {
    'botName':        botName,
    'org':            'ORGANIZATION_NAME',
    'flow':           'FLOW_NAME',
    'userToken':      'YOUR_FLOW_USER_TOKEN',
    'apiToken':       'YOUR_FLOW_API_TOKEN',
    'welcomeMessage': welcome,
    'travis':         true
  }
};

module.exports = config;