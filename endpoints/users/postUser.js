"use strict";
const AWS = require("aws-sdk");

AWS.config.update({ region: "eu-west-2" });

exports.handler = async (event, context) => {
  const dbb = new AWS.DynamoDB({ apiVersion: "2012-10-08" });
  const documentClient = new AWS.DynamoDB.DocumentClient({
    region: "eu-west-2",
  });
  const { username, email, password } = JSON.parse(event.body);

  const params = {
    TableName: "User-Data",
    Item: {
      email: email,
      username: username,
      password: password,
      userPlants: [],
    },
  };

  let user = "";
  let statusCode = 0;

  try {
    const data = await documentClient.put(params).promise();
    user = JSON.stringify(data.Item);
    statusCode = 201;
  } catch (err) {
    user = "Unable to create user, please try again";
    if (err.statusCode) {
      statusCode = err.statusCode;
    } else {
      statusCode = 500;
    }
  }

  const response = {
    statusCode: statusCode,
    headers: {
      my_header: "my_value",
    },
    body: user,
    isBase64Encoded: false,
  };

  return response;
};
