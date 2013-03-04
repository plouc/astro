var request   = require('request'),
  Emitter     = require('events').EventEmitter,
  Buffer      = require('buffer').Buffer,
  querystring = require('querystring');


/**
 * Simple bot class, listen/send messages.
 *
 * @param config
 * @constructor
 */
var Bot = function(config) {
  this.config = config;
};
Bot.prototype = Object.create(Emitter.prototype);


/**
 *
 * @return {*}
 */
Bot.prototype.listen = function() {
  var self = this;

  request.get('https://stream.flowdock.com/flows/' + this.config.org + '/' + this.config.flow, {
    'auth': {
      'user': this.config.userToken,
      'pass': 'whatever'
    }
  })
  .on('data', function(data) {
    if (data.length) {
      var dataStr = data.toString('utf8').trim();
      if (dataStr.length) {
        var dataObj = JSON.parse(dataStr);
        if (dataObj.event == 'message') {
          self.emit('message', dataObj);
        }
      }
    }
  });

  return this;
};


/**
 * Send a message to flowdock.
 *
 * @param {string} message
 * @param {Array}  tags
 * @return {*}
 */
Bot.prototype.send = function(message, tags) {
  var messageObject = {
    'content':            message,
    'external_user_name': this.config.botName,
    'tags':               tags || []
  };
  var messageString = JSON.stringify(messageObject);

  console.log('sending message: ' + message);
  request.post({
    'url':  'https://api.flowdock.com/v1/messages/chat/' + this.config.apiToken,
    'body': messageString,
    'encoding': 'utf8',
    'headers':   {
      'Content-Type':   'application/json',
      'Content-Length': Buffer.byteLength(messageString, 'utf8'),
      'Accept':         'application/json'
    }
  })
  .on('data', function(data) {
    console.log('send feedback', data.toString());
  })
  .on('error', function(err) {
    console.log('send error', err);
  });

  return this;
};

module.exports = Bot;