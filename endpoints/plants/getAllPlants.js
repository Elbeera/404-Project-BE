"use strict";
const AWS = require("aws-sdk");

AWS.config.update({ region: "eu-west-2" });

exports.handler = async (event, context) => {
  const documentClient = new AWS.DynamoDB.DocumentClient({
    region: "eu-west-2",
  });

  const params = {
    TableName: "Plant-Data-New",
  };

  let plants = "";
  let statusCode = 0;

  try {
    const data = await documentClient.scan(params).promise();
    if (event.queryStringParameters && event.queryStringParameters.category) {
      console.log("query worked");
      const filteredPlants = data.Items.filter(
        (plant) => plant.category === event.queryStringParameters.category
      );
      plants = JSON.stringify(filteredPlants);
    } else {
      plants = JSON.stringify(data.Items);
    }
    statusCode = 200;
  } catch (err) {
    console.log(err);
    plants = "Unable to get plant data";
    statusCode = 404;
  }

  const response = {
    statusCode: statusCode,
    headers: {
      my_header: "my_value",
    },
    body: plants,
    isBase64Encoded: false,
  };

  return response;
};
