"use strict";
const AWS = require("aws-sdk");

AWS.config.update({ region: "eu-west-2" });

exports.handler = async (event, context) => {
  const dbb = new AWS.DynamoDB({ apiVersion: "2012-10-08" });
  const documentClient = new AWS.DynamoDB.DocumentClient({
    region: "eu-west-2",
  });

  const { username } = event.pathParameters;

  const params = {
    TableName: "User-Data",
    Key: {
      username: username,
    },
  };

  let user = "";
  let statusCode = 0;

  try {
    const data = await documentClient.scan(params).promise();
    user = JSON.stringify(data.Item);
    statusCode = 200;
  } catch (err) {
    user = "Unable to get user, please try again";
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
  };

  return response;
};
