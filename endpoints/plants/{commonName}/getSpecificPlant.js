"use strict";
const AWS = require("aws-sdk");

AWS.config.update({ region: "eu-west-2" });

exports.handler = async (event, context) => {
  const documentClient = new AWS.DynamoDB.DocumentClient({
    region: "eu-west-2",
  });

  const { commonName } = event.pathParameters;

  const params = {
    TableName: "Plant-Data-New",
    Key: {
      commonName: commonName,
    },
  };

  let selectedPlant = "";
  let statusCode = 0;

  try {
    const data = await documentClient.get(params).promise();
    if (!data.Item) {
      selectedPlant = "Plant Not Found";
      statusCode = 404;
    } else {
      selectedPlant = JSON.stringify(data.Item);
      statusCode = 200;
    }
  } catch (err) {
    console.log(err);
    selectedPlant = "Internal Server Error";
    statusCode = 500;
  }

  const response = {
    statusCode: statusCode,
    headers: {
      my_header: "my_value",
    },
    body: selectedPlant,
    isBase64Encoded: false,
  };

  return response;
};
