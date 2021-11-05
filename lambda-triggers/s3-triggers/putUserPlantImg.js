"use strict";
const AWS = require("aws-sdk");
const s3 = new AWS.S3({ apiVersion: "2006-03-01" });

exports.handler = async (event, context, callback) => {
  const bucket = event.Records[0].s3.bucket.name;
  const key = decodeURIComponent(
    event.Records[0].s3.object.key.replace(/\+/g, " ")
  );

  const params = {
    Bucket: bucket,
    Key: key,
  };

  try {
    const { ContentType } = await s3.getObject(params).promise();

    console.log(ContentType);
    // console.log(data);a
  } catch (err) {
    console.log(err);
  }
};
