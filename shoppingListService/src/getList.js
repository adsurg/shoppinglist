'use strict';

module.exports.getList = (event, context, callback) => {
  const response = {
    statusCode: 200,
    body: JSON.stringify([{
        name: "lemons",
        quantity: 2
      },{
        name: "Bananas",
        quantity: 8
      }]),
  };

  callback(null, response);
};
