const { expect } = require("@jest/globals");
const request = require("supertest");
const app = "https://l81eyc3fja.execute-api.eu-west-2.amazonaws.com/beta";

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
    console.log(result.body);
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
