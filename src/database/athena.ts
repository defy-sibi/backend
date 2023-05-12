import AWS from "aws-sdk";
import "../../config/aws-config"; // Import your AWS configuration

const athena = new AWS.Athena({ apiVersion: "2017-05-18" });

const params = {
  QueryExecutionContext: {
    Database: "safmr",
  },
  ResultConfiguration: {
    OutputLocation: "s3://safmr-output-bucket-temp/",
  },
};

export { athena, params };
