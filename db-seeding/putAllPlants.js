"use strict";
const AWS = require("aws-sdk");
const allPlantData = require("./allPlantData");

AWS.config.update({ region: "eu-west-2" });

exports.handler = (event, context) => {
  const ddb = new AWS.DynamoDB({ apiVersion: "2012-10-08" });
  const documentClient = new AWS.DynamoDB.DocumentClient({
    region: "eu-west-2",
  });

  allPlantData.forEach(async (plant) => {
    const params = {
      TableName: "Plant-Data-New",
      Item: {
        commonName: plant.commonName,
        botanicalName: plant.botanicalName,
        category: plant.category,
        description: plant.description,
        wiki: plant.wiki,
        careDetails: plant.careDetails,
        image_url: plant.image_url,
      },
    };

    try {
      await documentClient.put(params).promise();
      console.log("plant inserted");
    } catch (err) {
      console.log(err);
    }
  });
};
