const allPlantData = require("./allPlantData");
const fs = require("fs");

const newPlantData = allPlantData.map((plant) => {
  const newPlant = { ...plant };

  newPlant.careDetails.avgMoist =
    (newPlant.careDetails.min_soil_moist +
      newPlant.careDetails.max_soil_moist) /
    2;

  const avgLux =
    (newPlant.careDetails.min_light_lux + newPlant.careDetails.max_light_lux) /
    2;

  newPlant.careDetails.avgLux = avgLux;

  if (avgLux < 5000) {
    newPlant.careDetails.lightRequirements = "Very low-light or heavy shade";
  } else if (avgLux < 30000 && avgLux >= 5000) {
    newPlant.careDetails.lightRequirements = "Low light or partial shade";
  } else if (avgLux < 60000 && avgLux >= 30000) {
    newPlant.careDetails.lightRequirements = "Medium-light or partial sun";
  } else {
    newPlant.careDetails.lightRequirements = "High-light or full-sun";
  }

  return newPlant;
});

fs.writeFile("./calcPlantData.js", JSON.stringify(newPlantData), (err) => {
  if (err) console.log(err);
  console.log("file created");
});
