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
    Key: {
      username: "example1-user",
    },
  };

  let userPlants = "";
  let statusCode = 0;

  try {
    const data = await documentClient.scan(params).promise();
    const userData = data.Items.filter((index) => {
      return index.username === params.Key.username;
    });
    userPlants = {
      username: userData[0].username,
      "user's plants": userData[0].userPlants,
    };
    statusCode = 200;
  } catch (err) {
    userPlants = "Unable to get user's Plants, please try again";
    if (err.statusCode) {
      statusCode = err.statusCode;
    } else {
      statusCode = 500;
    }
  }

  const response = {
    statusCode: statusCode,
    userPlants: userPlants,
  };

  return response;
};
