const items = [];

/**
  @typedef Item
  @type {object}
  @property {string} name - The product name
  @property {number} quantity - The number of products to buy
 */

 /**
 * retrieves shopping list entries
 * @return {Promise<Item[]>} an array of items to buy
 */
function getItems() {
    return window.fetch("https://t67uj0rkrl.execute-api.eu-west-1.amazonaws.com/dev/list")
        .then(response => response 
            && response.json())
}

/**
 * adds a shopping list entry
 * @param {string} name - The product name
 * @param {number} quantity - The number of products to buy
 */
function addItem(name, quantity){
    return window.fetch("https://t67uj0rkrl.execute-api.eu-west-1.amazonaws.com/dev/list", {
        method: 'PUT',
        body: JSON.stringify({name, quantity}),
        headers:{
          'Content-Type': 'application/json'
        }})
}

export {
    getItems,
    addItem
}