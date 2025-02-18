const fs = require("fs");
const S3 = require("aws-sdk/clients/s3");
try {
  const s3 = new S3({
    accessKeyId: process.env.AWS_CREDENTIALS_ACCESSKEY_ID,
    secretAccessKey: process.env.AWS_CREDENTIALS_SECRET_ACCESS_KEY,
  });

  const snapshotPath = process.argv.slice(2)[0];

  const readStream = fs.createReadStream(snapshotPath);

  const params = {
    Bucket: "mistertemp-dumps", // pass your bucket name
    Key: `auto-snapshot/${
      process.env.PROJECT_NAME || ""
    }${Date.now()}.heapsnapshot`, // file will be saved as testBucket/contacts.csv
    Body: readStream,
  };

  console.log("S3 upload start", snapshotPath);

  s3.upload(params, function (err) {
    readStream.destroy();

    if (err) {
      throw err;
    }

    console.log("S3 upload done");
  });
} catch (err) {
  console.log(err.message);
  console.log(err.stack);
}
