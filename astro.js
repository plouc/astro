var _            = require('underscore'),
  config         = require('./config.js'),
  Bot            = require('./lib/bot'),
  TeachCommand   = require('./lib/commands/teach-command'),
  ListCommand    = require('./lib/commands/list-command'),
  CommandChain   = require('./lib/commands/command-chain'),
  ProviderPool   = require('./lib/providers/provider-pool'),
  flow           = require('./lib/providers/flow-provider');


// append providers to the pool
var flowProvider = flow.flow(config.userToken, config.org, config.flow);
providerPool = new ProviderPool();
providerPool
  .add(flowProvider)
;


// append native commands to the chain
var commandChain = new CommandChain();
commandChain
  .add(new TeachCommand(commandChain, config.botName, providerPool))
  .add(new ListCommand(commandChain, config.botName))
;


// create the bot
var bot = new Bot(config);
bot
  .listen()
  .send(config.welcomeMessage)
  .on('message', function(message) {
    var processed = commandChain.exec(message);
    if (processed) {
      bot.send(processed.message, processed.tags);
    }
  })
;