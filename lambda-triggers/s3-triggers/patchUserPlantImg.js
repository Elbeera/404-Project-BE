const AWS = require("aws-sdk");

var s3 = new AWS.S3();
exports.handler = (event, context, callback) => {
  const { img } = JSON.parse(event.body);
  const { username, plant_id } = event.pathParameters;
  const key = `${username}_${plant_id}_${Date.now()}`;

  console.log(event.pathParameters);

  let decodedImage = Buffer.from(img, "base64");
  var params = {
    Body: decodedImage,
    Bucket: "user-plant-bucket",
    Key: key,
    ContentType: "image/png",
    Metadata: {
      username,
      plant_id,
      objectURL: `https://user-plant-bucket.s3.eu-west-2.amazonaws.com/${key}`,
    },
  };
  s3.upload(params, (err, data) => {
    if (err) {
      callback(err, null);
    } else {
      let response = {
        statusCode: 200,
        headers: {
          my_header: "my_value",
        },
        body: JSON.stringify(data),
        isBase64Encoded: false,
      };
      callback(null, response);
    }
  });
};
