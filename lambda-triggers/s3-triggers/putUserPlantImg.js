"use strict";
const AWS = require("aws-sdk");
const s3 = new AWS.S3({ apiVersion: "2006-03-01" });

exports.handler = async (event, context, callback) => {
  const documentClient = new AWS.DynamoDB.DocumentClient({
    region: "eu-west-2",
  });
  const bucket = event.Records[0].s3.bucket.name;
  const key = decodeURIComponent(
    event.Records[0].s3.object.key.replace(/\+/g, " ")
  );

  const s3Params = {
    Bucket: bucket,
    Key: key,
  };

  let responseBody = {};
  let statusCode = 0;

  try {
    const { Metadata } = await s3.getObject(s3Params).promise();

    // user -------------

    const userParams = {
      TableName: "User-Data",
      Key: {
        username: Metadata.username,
      },
    };

    const userData = await documentClient.get(userParams).promise();
    const userPlants = userData.Item.userPlants;
    const userPlantCommonName = "";

    const updatedPlants = userPlants.map((plant) => {
      if (plant.plant_id === Metadata.plant_id) {
        const updatedUserGallery = plant.userGallery
          ? [...plant.userGallery, Metadata.objecturl]
          : [Metadata.objecturl];
        plant.userGallery = updatedUserGallery;
        plant.image = Metadata.objecturl;
        userPlantCommonName = plant.commonName;
      }
      return plant;
    });

    const newUserParams = {
      TableName: "User-Data",
      Item: {
        username: userData.Item.username,
        email: userData.Item.email,
        userPlants: updatedPlants,
      },
    };

    await documentClient.put(newUserParams).promise();

    // plant -------------

    const plantParams = {
      TableName: "Plant-Data-New",
      Key: {
        commonName: userPlantCommonName,
      },
    };

    const { Item } = await documentClient.get(plantParams).promise();

    const updatedPlantGallery = Item.plantGallery
      ? [...Item.plantGallery, Metadata.objecturl]
      : [Metadata.objecturl];

    const updatedPlantItem = { ...Item };
    updatedPlantItem.plantGallery = updatedPlantGallery;

    const newPlantParams = {
      TableName: "Plant-Data-New",
      Item: updatedPlantItem,
    };

    await documentClient.put(newPlantParams).promise();

    responseBody.msg = "Plant image inserted";
    statusCode = 200;
  } catch (err) {
    console.log(err);
    responseBody.msg = "Unable to get user plant, please try again";
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
    body: JSON.stringify(responseBody),
    isBase64Encoded: false,
  };

  return response;
};
