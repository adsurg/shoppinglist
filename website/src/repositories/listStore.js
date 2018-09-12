const items = [];

/**
  @typedef Item
  @type {object}
  @property {string} name - The product name
  @property {number} quantity - The number of products to buy
 */

 /**
 * retrieves shopping list entries
 * @return {Item[]} an array of items to buy
 */
function getItems() {
    return items;
}

/**
 * adds a shopping list entry
 * @param {string} name - The product name
 * @param {number} quantity - The number of products to buy
 */
function addItem(name, quantity){
    items.push({name, quantity});
}

export {
    getItems,
    addItem
}