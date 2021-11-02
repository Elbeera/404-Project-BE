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
    plants = JSON.stringify(data.Items);
    statusCode = 200;
  } catch (err) {
    console.log(err);
    plants = "Unable to get plant data";
    statusCode = 404;
  }

  const response = {
    statusCode,
    plants,
  };

  return response;
};
