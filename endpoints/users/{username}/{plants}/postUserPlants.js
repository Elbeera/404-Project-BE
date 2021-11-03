"use strict";
const AWS = require("aws-sdk");

AWS.config.update({ region: "eu-west-2" });

exports.handler = async (event, context) => {
  const dbb = new AWS.DynamoDB({ apiVersion: "2012-10-08" });
  const documentClient = new AWS.DynamoDB.DocumentClient({
    region: "eu-west-2",
  });

  const { username } = event.pathParameters;
  const { nickName, commonName, img_url } = JSON.parse(event.body);

  const itemToAdd = {
    nickName: nickName,
    commonName: commonName,
    image: img_url,
    lastWatered: null,
    nextWatering: null,
  };

  const params = {
    TableName: "User-Data",
    Key: {
      username: username,
    },
  };

  let userData = "";
  let statusCode = 0;

  try {
    const data = await documentClient.get(params).promise();
    userData = data.Item.userPlants;
    userData.push(itemToAdd);

    const newUser = {
      TableName: "User-Data",
      Item: {
        username: data.Item.username,
        email: data.Item.email,
        password: data.Item.password,
        userPlants: userData,
      },
    };

    const putData = await documentClient.put(newUser).promise();

    console.log(data.Item);
    statusCode = 200;
  } catch (err) {
    userData = "Unable to get user's Plants, please try again";
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
    body: JSON.stringify(userData),
    isBase64Encoded: false,
  };

  return response;
};
