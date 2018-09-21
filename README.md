From the branch named 'startingpoint', we can browse to the folder '''/website''' and run '''yarn''' then ''' yarn start''' to see our webpage running in a local browser.

## Preamble
This is not an attempt to show how to create the perfect Serverless website, mearly to demonstrate how little affort is required to start to stitch these technologies together.  A number of problems are left unsolved here, by far the biggest is security.

## Copy website to aws
Let's share our website with the world by deploying it to a static site hosted in an S3 bucket.

We'll start by adding the serverless framework and the serverless-finch plugin to our yarn development dependencies.

```
yarn add serverless serverless-finch --dev
```

We're also going to ask serverless to bootstrap a basic project for us.
```
serverless create --template aws-nodejs --path shoppingListService
```

### Add to Serverless.yml
Now we just have to add a couple of lines to the bottom of the serverless.yml file to ask it to deploy the static web content to S3 and make it available from a URL.
```
custom:
  client:
    bucketName: my-shopping-list-demo
    distributionFolder: ../website/build

plugins:
  - serverless-finch    
—end
```
#### Deploy
First we're going to build the website
```
cd website
Yarn build
```
Then deploy it to S3
```
cd ../shoppingListService
AWS_PROFILE=home serverless client deploy --region eu-west-1
```

#### Admire the work so far
And now we can browse to 
Browse to the URL shown at the end of the deployment to admire our handywork.

#### It takes two commands to build your website?

Add the following to the bottom of package.json.
```
  "scripts": {
    "deploy": "cd website && yarn build && cd ../shoppingListService && serverless client deploy --region eu-west-1"
  }
```
Now we can build by running 

```AWS_PROFILE=home yarn run deploy```

## Move persistence logic to the cloud

Rename handler.js as getList.js and move it into a new folder named src

####replace hello in getList.js with
```
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
```

####Add the following to package.json.
```
  getList:
    handler: src/getList.getList
    events:
      - http:
          path: list
          method: get
          cors: true
```

From the folder shoppingListService, run
```
AWS_PROFILE=home serverless deploy --region eu-west-1
```
Browse to the url returned by the deployment

We can make this easier to deploy by altering package.json
```
"deploy": "cd website && yarn build && cd ../shoppingListService && serverless deploy --region eu-west-1 && serverless client deploy --region eu-west-1"
```

## Connect the web page to the service

#### Alter App.js
```
  constructor(props){
    super(props)
    this.state={};
    this.updateItems();
  }
  updateItems(){
    getItems()
      .then(
      items => this.setState({items}));
  }
```

#### Replace getItems in listStore.js
```
function getItems() {
    return window.fetch("https://t67uj0rkrl.execute-api.eu-west-1.amazonaws.com/dev/list")
        .then(response => response 
            && response.json())
}
```

```AWS_PROFILE=home yarn run deploy```

Reload and show the page reading from the lambda.

## Use a lambda to write
#### Create putItem.js
Use the URL returned by the deployment
```
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
```
#### Add our new lambda to Serverless.yml
```
  putItem:
    handler: src/putItem.putItem
    events:
      - http:
          path: list
          method: put
          cors: true
```

```AWS_PROFILE=home yarn run deploy```
#### Alter addItem in listStore.js
Use the URL returned by the deployment
```
function addItem(name, quantity){
    return window.fetch("https://t67uj0rkrl.execute-api.eu-west-1.amazonaws.com/dev/list", {
        method: 'PUT', // or 'PUT'
        body: JSON.stringify({name, quantity}),
        headers:{
          'Content-Type': 'application/json'
        }})
}
```
#### Alter addItem of NewItem.js
```
    addItem(){
        addItem(this.state.name, this.state.quantity)
        .then(() => {
            this.props.onChange && this.props.onChange();
            this.setState({name: "", quantity: 0});
        });
    }
```
```AWS_PROFILE=home yarn run deploy```

This would be a good time to open the AWS console and look at some CloudWatch logs.

## Let's connect the lambdas to a database
#### Alter Serverless.yml to create the database and grant access to the lambdas.
```
provider:
  name: aws
  runtime: nodejs6.10
  tracing: true
  iamRoleStatements:
      - Effect: Allow
        Action:
          - dynamodb:PutItem
          - dynamodb:Scan
        Resource: "arn:aws:dynamodb:*"

resources:
  Resources:
    TaxRateTable:
      Type: "AWS::DynamoDB::Table"
      Properties:
        TableName: "ShoppingListEntry"
        AttributeDefinitions:
        - AttributeName: "product"
          AttributeType: "S"
        KeySchema:
        - AttributeName: "product"
          KeyType: "HASH"
        ProvisionedThroughput:
          ReadCapacityUnits: 2
          WriteCapacityUnits: 2  
```
```AWS_PROFILE=home yarn run deploy```

With the console open we could take a look at the newly created table.

#### Replace the contents of getList.js
```
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
  ```
#### Replace the contents of putItem.js
```
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
```
```AWS_PROFILE=home yarn run deploy```

## When we're done
```
AWS_PROFILE=home serverless remove
AWS_PROFILE=home serverless client remove
```
