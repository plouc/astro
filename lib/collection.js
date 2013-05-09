var _ = require('underscore');



function Collection() {
  this.items      = [];
  this.namedItems = {};
}


/**
 * Add an item to the collection.
 *
 * @param item
 */
Collection.prototype.add = function(item) {
  if (!item.hasOwnProperty('name')) {
    throw 'Collection only support items having a \'name\' property';
  }

  this.items.push(item);
  this.namedItems[item.name] = item;
};


/**
 * Get an item by its name.
 *
 * @param itemName
 * @return {*}
 */
Collection.prototype.get = function(itemName) {
  if (this.namedItems.hasOwnProperty(itemName)) {
    return this.namedItems[itemName];
  }

  return false;
};


/**
 * Check if an item exists with the given name.
 *
 * @param itemName
 * @return {*}
 */
Collection.prototype.has = function(itemName) {
  return this.namedItems.hasOwnProperty(itemName);
};


/**
 * Remove an item.
 *
 * @param item
 */
Collection.prototype.remove = function(item) {
  var name = _.isString(item) ? item : item.name;

  if (this.namedItems.hasOwnProperty(name)) {
    delete this.namedItems[name];
  }

  this.items = _.filter(this.items, function(item) {
    return item.name !== name;
  });

  return this;
};

module.exports = Collection;