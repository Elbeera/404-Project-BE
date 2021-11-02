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
  };

  let users = "";
  let statusCode = 0;

  try {
    const data = await documentClient.scan(params).promise();
    users = data;
    statusCode = 200;
    console.log(data);
  } catch (err) {
    users = "Unable to get users, please try again";
    if (err.statusCode) {
      statusCode = err.statusCode;
    } else {
      statusCode = 500;
    }
    console.log(err);
  }

  const response = {
    statusCode: statusCode,
    allUsers: users,
  };

  return response;
};
