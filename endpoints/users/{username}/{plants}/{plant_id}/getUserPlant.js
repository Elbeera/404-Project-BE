"use strict";
const AWS = require("aws-sdk");

AWS.config.update({ region: "eu-west-2" });

exports.handler = async (event, context) => {
  const dbb = new AWS.DynamoDB({ apiVersion: "2012-10-08" });
  const documentClient = new AWS.DynamoDB.DocumentClient({
    region: "eu-west-2",
  });

  const { username, plant_id } = event.pathParameters;

  const params = {
    TableName: "User-Data",
    Key: {
      username: username,
    },
  };

  let filteredPlants = "";
  let statusCode = 0;

  try {
    const data = await documentClient.get(params).promise();
    const plants = data.Item.userPlants;
    filteredPlants = plants.filter((plant) => {
      return plant.plant_id === plant_id;
    });
    statusCode = 200;
  } catch (err) {
    filteredPlants = "Unable to get user plant, please try again";
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
    body: JSON.stringify(filteredPlants),
    isBase64Encoded: false,
  };

  return response;
};
