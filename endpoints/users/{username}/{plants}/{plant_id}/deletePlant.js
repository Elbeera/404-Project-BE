"use strict";
const AWS = require("aws-sdk");

AWS.config.update({ region: "eu-west-2" });

exports.handler = async (event, context) => {
  const dbb = new AWS.DynamoDB({ apiVersion: "2012-10-08" });
  const documentClient = new AWS.DynamoDB.DocumentClient({
    region: "eu-west-2",
  });

  const { plant_id, username } = event.pathParameters;

  const params = {
    TableName: "User-Data",
    Key: {
      username: username,
    },
  };

  let user = "";
  let statusCode = 0;

  try {
    const data = await documentClient.get(params).promise();
    user = data.Item.userPlants;
    const filteredPlants = user.filter((index) => {
      return index.nickName !== plant_id;
    });
    console.log(filteredPlants);

    const newParam = {
      TableName: "User-Data",
      Item: {
        username: data.Item.username,
        email: data.Item.email,
        password: data.Item.password,
        userPlants: filteredPlants,
      },
    };
    user = await documentClient.put(newParam).promise();

    statusCode = 200;
  } catch (err) {
    user = "Unable to get user, please try again";
    if (err.statusCode) {
      statusCode = err.statusCode;
    } else {
      statusCode = 500;
      console.log(err);
    }
  }

  const response = {
    statusCode: statusCode,
    headers: {
      my_header: "my_value",
    },
    body: JSON.stringify(user),
  };

  return response;
};
