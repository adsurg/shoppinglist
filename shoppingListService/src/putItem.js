'use strict';

const AWS = require('aws-sdk');
AWS.config.update({region: 'eu-west-1'});

const dynamoDb = new AWS.DynamoDB({apiVersion: '2012-10-08'});

module.exports.putItem = (event, context, callback) => {
    const listItem = JSON.parse(event.body)
  
    dynamoDb.putItem({
      TableName: 'ShoppingListEntry',
      Item: {
        'product' : {S: listItem.name},
        'quantity' : {N: `${listItem.quantity}`},
      }
    }, (err, data) => {
      if(err){
        callback(err)
        return;
      }
  
      callback(null, {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': 'http://my-shopping-list-demo.s3-website-eu-west-1.amazonaws.com',
        },
        body: ""
      })})
  };