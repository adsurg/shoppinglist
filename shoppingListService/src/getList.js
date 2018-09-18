'use strict';

const AWS = require('aws-sdk');
AWS.config.update({region: 'eu-west-1'});

const dynamoDb = new AWS.DynamoDB({apiVersion: '2012-10-08'});

module.exports.getList = (event, context, callback) => 
  dynamoDb.scan({
    TableName: "ShoppingListEntry",
    Select:"ALL_ATTRIBUTES"
  }, 
  (err, data) => {
    if(err){
      callback(err);
      return;
    }

    callback(null, {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': 'http://my-shopping-list-demo.s3-website-eu-west-1.amazonaws.com',
      },
      body: JSON.stringify(
        data.Items.map(
          item => ({
              name: item.product.S,
              quantity: Number(item.quantity.N)
            })))
    });
  });
