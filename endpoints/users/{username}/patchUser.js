"use strict";
const AWS = require("aws-sdk");

AWS.config.update({ region: "eu-west-2" });

exports.handler = async (event, context) => {
  const dbb = new AWS.DynamoDB({ apiVersion: "2012-10-08" });
  const documentClient = new AWS.DynamoDB.DocumentClient({
    region: "eu-west-2",
  });

  const { username } = event.pathParameters;
  const { newUserName } = JSON.parse(event.body);

  const params = {
    TableName: "User-Data",
    Key: {
      username: username,
    },
  };

  let updatedUser = "";
  let statusCode = 0;

  try {
    const data = await documentClient.get(params).promise();
    const newParams = {
      TableName: "User-Data",
      Item: {
        username: newUserName,
        email: data.Item.email,
        password: data.Item.password,
        userPlants: data.Item.userPlants,
      },
    };

    const updateUser = await documentClient.put(newParams).promise();
    const deleteUser = await documentClient.delete(params).promise();

    const newUserDetails = {
      TableName: "User-Data",
      Key: {
        username: newUserName,
      },
    };

    updatedUser = await documentClient.get(newUserDetails).promise();

    statusCode = 200;
  } catch (err) {
    updatedUser = "Unable to get user, please try again";
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
    body: JSON.stringify(updatedUser),
    isBase64Encoded: false,
  };

  return response;
};
