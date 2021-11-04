"use strict";
const AWS = require("aws-sdk");

AWS.config.update({ region: "eu-west-2" });

exports.handler = async (event, context, callback) => {
  const dbb = new AWS.DynamoDB({ apiVersion: "2012-10-08" });
  const documentClient = new AWS.DynamoDB.DocumentClient({
    region: "eu-west-2",
  });

  event.response.autoConfirmUser = true;

  if (event.request.userAttributes.hasOwnProperty("email")) {
    event.response.autoVerifyEmail = true;
  }

  callback(null, event);

  const userEvent = event.request;

  const params = {
    TableName: "User-Data",
    Item: {
      // email: userEvent.UserAttributes.email,
      username: userEvent.Username,
      userPlants: [],
    },
    ReturnValues: "ALL_NEW",
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

  const response = {
    statusCode: statusCode,
    headers: {
      my_header: "my_value",
    },
    body: JSON.stringify(newUser),
    isBase64Encoded: false,
  };

  return response;
};
