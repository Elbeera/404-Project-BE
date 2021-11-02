"use strict";
const AWS = require("aws-sdk");

AWS.config.update({ region: "eu-west-2" });

exports.handler = async (event, context) => {
  const dbb = new AWS.DynamoDB({ apiVersion: "2012-10-08" });
  const documentClient = new AWS.DynamoDB.DocumentClient({
    region: "eu-west-2",
  });

  const params = {
    TableName: "User-Data",
    Item: {
      email: "example@example.com",
      username: "example-user",
      password: "example-password",
    },
  };

  let user = "";
  let statusCode = 0;

  try {
    const data = await documentClient.put(params).promise();
    user = data;
    statusCode = 201;
    console.log(data);
  } catch (err) {
    user = "Unable to create user, please try again";
    statusCode = 500;
    console.log(err);
  }

  const response = {
    statusCode: statusCode,
    myUser: {
      body: user,
    },
  };

  return response;
};
