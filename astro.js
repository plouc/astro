var _                = require('underscore'),
  configs            = require('./config.js'),
  Q                  = require('q'),
  Bot                = require('./lib/bot'),
  TeachCommand       = require('./lib/commands/teach-command'),
  ListCommand        = require('./lib/commands/list-command'),
  SoCommand          = require('./lib/commands/so-command'),
  PointCommand       = require('./lib/commands/point-command'),
  NewRelicCommand    = require('./lib/commands/new-relic-command'),
  TravisCommand      = require('./lib/commands/travis-command'),
  ReminderCommand    = require('./lib/commands/reminder-command'),
  CommandCollection  = require('./lib/commands/command-collection'),
  ProviderCollection = require('./lib/providers/provider-collection'),
  flow               = require('./lib/providers/flow-provider'),
  NewRelicProvider   = require('./lib/providers/new-relic-provider'),
  TravisProvider     = require('./lib/providers/travis-provider');


// get config according to given profile
var configKey = process.argv[2];
if (configKey === undefined || !configs.hasOwnProperty(configKey)) {
  throw 'Please provide a valid config profile';
}
var config = configs[configKey];


// append providers to the pool
var flowProvider = flow.flow(config.userToken, config.org, config.flow);
providerCollection = new ProviderCollection();
providerCollection
  .add(flowProvider)
;


// append native commands to the chain
var commandCollection = new CommandCollection();
commandCollection
  .add(new TeachCommand(commandCollection, config.botName, providerCollection))
  .add(new ListCommand(commandCollection, config.botName))
  .add(new SoCommand(config.botName))
  .add(new PointCommand(config.botName, providerCollection))
  .add(new ReminderCommand(config.botName, providerCollection))
;


if (config['new-relic']) {
  var newRelicProvider = new NewRelicProvider(config['new-relic']);
  var newRelicCommand  = new NewRelicCommand(newRelicProvider, config.botName);
  commandCollection.add(newRelicCommand);
}

if (config['travis']) {
  var travisProvider = new TravisProvider(config['travis']);
  var travisCommand  = new TravisCommand(travisProvider, config.botName);
  commandCollection.add(travisCommand);
}


// create the bot
var bot = new Bot(config);
bot
  .listen()
  .send(config.welcomeMessage)
  .on('message', function(message) {
    var processed = commandCollection.exec(message);
    if (processed) {
      Q.when(processed, function (response) {
        bot.send(response.message, response.tags);
        console.log('when resolved', response);
      }, function (error) {
        console.log('when failed', error);
      });
    }
  })
;