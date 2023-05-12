import AWS from "aws-sdk";
import "dotenv/config";

//AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY is set as env variable
const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
const region = "us-east-2";

AWS.config.update({
  accessKeyId,
  secretAccessKey,
  region,
});

export const rdsConfig = {
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT),
  ssl: {
    rejectUnauthorized: process.env.DB_SSL_REJECT_UNAUTHORIZED === 'true',
  }
}
