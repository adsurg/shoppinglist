'use strict';

module.exports.putItem = (event, context, callback) => {
  const listItem = JSON.parse(event.body)

  console.log(JSON.stringify(listItem))

  const response = {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': 'http://my-shopping-list-demo.s3-website-eu-west-1.amazonaws.com',
    },
    body: ""
  };

  callback(null, response);
};
