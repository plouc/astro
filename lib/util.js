var _ = require('underscore');


module.exports.isInt = function(input) {
  return ((input - 0) == input && input % 1==0);
};


module.exports.regexcape = function(str) {
  return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
};

module.exports.objectAccess = function(object, access) {
  if (null === object || undefined === object || !_.isObject(object)) {
    return object;
  }

  var value = object
    , parts = access.split('.');

  // remove first root element
  parts.shift();

  _.each(parts, function(part) {
    if (value.hasOwnProperty(part)) {
      value = value[part];
    }
  });

  return value;
};
