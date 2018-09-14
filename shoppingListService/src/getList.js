'use strict';

module.exports.getList = (event, context, callback) => {
  const response = {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': 'http://my-shopping-list-demo.s3-website-eu-west-1.amazonaws.com',
    },
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
