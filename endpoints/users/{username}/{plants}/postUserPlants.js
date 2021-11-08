"use strict";
const AWS = require("aws-sdk");

AWS.config.update({ region: "eu-west-2" });

exports.handler = async (event, context) => {
  const dbb = new AWS.DynamoDB({ apiVersion: "2012-10-08" });
  const documentClient = new AWS.DynamoDB.DocumentClient({
    region: "eu-west-2",
  });

  const { username } = event.pathParameters;
  const { nickName, commonName, userImage } = JSON.parse(event.body);

  const userParams = {
    TableName: "User-Data",
    Key: {
      username: username,
    },
  };

  const plantParams = {
    TableName: "Plant-Data-New",
    Key: {
      commonName: commonName,
    },
  };

  let newUserPlants = [];
  let statusCode = 0;

  try {
    const userData = await documentClient.get(userParams).promise();
    const plantData = await documentClient.get(plantParams).promise();

    const plantId = `${username}-${Date.now()}`;

    const itemToAdd = {
      plant_id: plantId,
      nickName: nickName ? nickName : commonName,
      commonName: commonName,
      image: userImage ? userImage : plantData.Item.image_url,
      lastWatered: null,
      nextWatering: null,
    };

    const updatedPlants = [...userData.Item.userPlants, itemToAdd];

    const updatedUser = {
      TableName: "User-Data",
      Item: {
        username: userData.Item.username,
        email: userData.Item.email,
        userPlants: updatedPlants,
      },
    };

    await documentClient.put(updatedUser).promise();

    const insertedUser = await documentClient.get(userParams).promise();

    newUserPlants = insertedUser.Item.userPlants.find(
      (plant) => plant.plant_id === plantId
    );

    statusCode = 200;
  } catch (err) {
    newUserPlants = "Unable to get user's Plants, please try again";
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
    body: JSON.stringify(newUserPlants),
    isBase64Encoded: false,
  };

  return response;
};
