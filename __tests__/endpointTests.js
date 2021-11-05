const { expect } = require("@jest/globals");
const request = require("supertest");
const app = "https://l81eyc3fja.execute-api.eu-west-2.amazonaws.com/beta";
// NOTE: We need to remember to update the base URL above once API is deployed from beta to production

// NOTE: POST /users is not tested as this interaction happens between Cognito and Lambda directly

describe("GET /plants", () => {
  test("200: responds with an array of all plants", async () => {
    const result = await request(app).get("/plants").expect(200);
    expect(result.body.length).toBe(223);
    result.body.forEach((plant) => {
      expect(plant).toMatchObject({
        commonName: expect.any(String),
        wiki: expect.any(String),
        careDetails: {
          min_soil_moist: expect.any(Number),
          min_temp: expect.any(Number),
          max_env_humid: expect.any(Number),
          min_env_humid: expect.any(Number),
          min_light_lux: expect.any(Number),
          min_soil_ec: expect.any(Number),
          max_light_mmol: expect.any(Number),
          max_light_lux: expect.any(Number),
          max_soil_ec: expect.any(Number),
          max_temp: expect.any(Number),
          min_light_mmol: expect.any(Number),
          max_soil_moist: expect.any(Number),
        },
        category: expect.any(String),
        botanicalName: expect.any(String),
        image_url: expect.any(String),
        description: expect.any(String),
      });
    });
  });
});

describe("GET /plants?category=category", () => {
  test("200: responds with an array of all Flowering House Plants", async () => {
    const result = await request(app)
      .get("/plants?category=Flowering House Plants")
      .expect(200);
    expect(result.body.length).toBe(92);
    result.body.forEach((plant) => {
      expect(plant).toMatchObject({
        commonName: expect.any(String),
        wiki: expect.any(String),
        careDetails: {
          min_soil_moist: expect.any(Number),
          min_temp: expect.any(Number),
          max_env_humid: expect.any(Number),
          min_env_humid: expect.any(Number),
          min_light_lux: expect.any(Number),
          min_soil_ec: expect.any(Number),
          max_light_mmol: expect.any(Number),
          max_light_lux: expect.any(Number),
          max_soil_ec: expect.any(Number),
          max_temp: expect.any(Number),
          min_light_mmol: expect.any(Number),
          max_soil_moist: expect.any(Number),
        },
        category: expect.any(String),
        botanicalName: expect.any(String),
        image_url: expect.any(String),
        description: expect.any(String),
      });
    });
  });
});

describe("GET /plants?search=searchCriteria", () => {
  test("200: responds with plant(s) matched with search input", async () => {
    const result = await request(app).get("/plants?search=Sago").expect(200);
    expect(result.body.length).toBe(1);
    expect(result.body[0]).toMatchObject({
      wiki: "wikipedia.org/wiki/Cycas_revoluta",
      careDetails: {
        min_soil_moist: 15,
        min_temp: 6,
        max_env_humid: 85,
        min_env_humid: 30,
        min_light_lux: 3500,
        min_soil_ec: 350,
        max_light_mmol: 6700,
        max_light_lux: 65000,
        max_soil_ec: 2000,
        max_temp: 32,
        min_light_mmol: 2700,
        max_soil_moist: 60,
      },
      category: "Foliage House Plants",
      botanicalName: "Cycas revoluta",
      commonName: "Sago Palm",
      image_url:
        "https://objectstorage.ap-sydney-1.oraclecloud.com/n/sdyd5yr3jypo/b/plant-img/o/cycas%20revoluta.jpg",
      description:
        "Cycas revoluta (Sotetsu [Japanese ソテツ], sago palm, king sago, sago cycad, Japanese sago palm), is a species of gymnosperm in the family Cycadaceae, native to southern Japan including the Ryukyu Islands. It is one of several species used for the production of sago, as well as an ornamental plant. The sago cycad can be distinguished by a thick coat of fibers on its trunk. The sago cycad is sometimes mistakenly thought to be a palm, although the only similarity between the two is that they look similar and both produce seeds. The leaves grow from the trunk and start out as small leaves near the centre of the plant.",
    });
  });
});

describe("GET /plants/commonName", () => {
  test("200: responds with plant matched with commonName input", async () => {
    const result = await request(app).get("/plants/Snapdragons").expect(200);
    expect(result.body).toMatchObject({
      wiki: "wikipedia.org/wiki/Antirrhinum_majus",
      careDetails: {
        min_soil_moist: 15,
        min_temp: 5,
        max_env_humid: 80,
        min_env_humid: 30,
        min_light_lux: 2500,
        min_soil_ec: 350,
        max_light_mmol: 5000,
        max_light_lux: 50000,
        max_soil_ec: 2000,
        max_temp: 35,
        min_light_mmol: 3500,
        max_soil_moist: 60,
      },
      category: "Flowering House Plants",
      botanicalName: "Antirrhinum majus",
      commonName: "Snapdragons",
      image_url:
        "https://objectstorage.ap-sydney-1.oraclecloud.com/n/sdyd5yr3jypo/b/plant-img/o/antirrhinum%20majus.jpg",
      description:
        'Antirrhinum majus, the common snapdragon (often - especially in horticulture - simply "snapdragon"), is a species of flowering plant belonging to the genus Antirrhinum. The plant was placed in the family Plantaginaceae following a revision of its prior classical family, Scrophulariaceae.The common name "snapdragon", originates from the flowers\' reaction to having their throats squeezed, which causes the "mouth" of the flower to snap open like a dragon\'s mouth. It is widely used as an ornamental plant in borders and as a cut flower. It is perennial but usually cultivated as an annual plant. The species has been in culture since the 15th century.',
    });
  });
});

describe("GET /users", () => {
  test("200: responds with all users", async () => {
    const result = await request(app).get("/users").expect(200);
    result.body.allUsers.Items.forEach((user) => {
      expect.objectContaining({
        username: expect.any(String),
      });
    });
  });
});

describe("GET /users/username", () => {
  test("200: responds with user with given username", async () => {
    const result = await request(app).get("/users/MelAxiosTest").expect(200);
    expect(result.body).toMatchObject({
      password: "example4-password",
      username: "MelAxiosTest",
      email: "example4@example.com",
      userPlants: [],
    });
  });
});
