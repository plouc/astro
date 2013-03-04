var _ = require('underscore');
_.str = require('underscore.string');

function HelpBuilder() {
  this.width = 80;
}

HelpBuilder.prototype.build = function(commandName, author, body) {
  var title        = commandName + ' help',
    titleAuthor    = 'author: ' + author,
    titleHoleWidth = this.width - (title.length + titleAuthor.length);

  var help = '\t' + title + _.str.repeat(' ', titleHoleWidth) + titleAuthor + '\n'
           + '\t' + _.str.repeat('-', this.width) + '\n'
           + body;

  return help;
};

var helpBuilder = new HelpBuilder();

module.exports.build = function(commandName, author, body) {
  return helpBuilder.build(commandName, author, body);
};