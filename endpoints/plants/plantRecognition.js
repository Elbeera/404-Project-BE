"use strict";
const AWS = require("aws-sdk");

exports.handler = async (event, context, callback) => {
  const documentClient = new AWS.DynamoDB.DocumentClient({
    region: "eu-west-2",
  });

  const { plantsFromPlantId } = JSON.parse(event.body);

  const params = {
    TableName: "Plant-Data-New",
  };

  let plants = "";
  let statusCode = 0;

  try {
    const data = await documentClient.scan(params).promise();

    const suggestedPlants = plantsFromPlantId.map((suggestedPlant) => {
      const filteredPlants = data.Items.filter((plant) => {
        const regex = new RegExp(`.*${suggestedPlant.botanicalName}.*`, "gi");
        return regex.test(plant.botanicalName);
      }).map((plant) => {
        return {
          ...plant,
          probability: `${(suggestedPlant.probability * 100).toFixed(2)}%`,
        };
      });
      return filteredPlants;
    });

    if (suggestedPlants.flat().length === 0) {
      plants = "Plant not recognised";
    } else {
      plants = JSON.stringify(suggestedPlants.flat());
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
