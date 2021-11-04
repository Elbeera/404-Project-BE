"use strict";
const AWS = require("aws-sdk");
const s3 = new AWS.s3();

exports.handler = async (event, context, callback) => {
  const { name } = event.Records[0].s3.bucket;
  const { key } = event.Records[0].s3.object;

  const params = {
    Bucket: name,
    Key: key,
  };

  try {
    const data = await s3.getObject(params).promise();
    const userImgStr = data.Body.toString();
    const parsedImg = JSON.parse(userImgStr);

    console.log(data);
  } catch (err) {
    console.log(err);
  }
};
