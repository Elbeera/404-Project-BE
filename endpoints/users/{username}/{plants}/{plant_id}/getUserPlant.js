"use strict";
const AWS = require("aws-sdk");

AWS.config.update({ region: "eu-west-2" });

exports.handler = async (event, context) => {
  const dbb = new AWS.DynamoDB({ apiVersion: "2012-10-08" });
  const documentClient = new AWS.DynamoDB.DocumentClient({
    region: "eu-west-2",
  });

  const { username, nickName } = event.pathParameters;

  const params = {
    TableName: "User-Data",
    Key: {
      username: username,
    },
  };

  let plants = "";
  let statusCode = 0;

  try {
    const data = await documentClient.get(params).promise();
    plants = data.Item.userPlants;
    const filteredPlants = plants.filter((index) => {
      return index.nickName === nickName;
    });
    statusCode = 200;
  } catch (err) {
    plants = "Unable to get user plant, please try again";
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
    body: JSON.stringify(plants),
    isBase64Encoded: false,
  };

  return response;
};
