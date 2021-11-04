"use strict";
const AWS = require("aws-sdk");

AWS.config.update({ region: "eu-west-2" });

exports.handler = async (event, context, callback) => {
  const dbb = new AWS.DynamoDB({ apiVersion: "2012-10-08" });
  const documentClient = new AWS.DynamoDB.DocumentClient({
    region: "eu-west-2",
  });
  console.log(event, "<-------");
  const params = {
    TableName: "User-Data",
    Item: {
      email: event.request.userAttributes.email,
      username: event.userName,
      userPlants: [],
    },
  };

  let newUser = "";
  let statusCode = 0;

  try {
    const data = await documentClient.put(params).promise();
    newUser = data.Item;
    statusCode = 201;
  } catch (err) {
    newUser = "Unable to create user, please try again";
    if (err.statusCode) {
      statusCode = err.statusCode;
    } else {
      statusCode = 500;
    }
    console.log(err);
  }

  context.done(null, event);
};
