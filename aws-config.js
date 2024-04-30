
// it is AWS config file 

const AWS=require('aws-sdk');
require('dotenv').config();

//test for config 
console.log("AWS config file loaded");

AWS.config.update({
    region:process.env.AWS_REGION,
    accessKeyId:process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey:process.env.AWS_SECRET_ACCESS_KEY
});

const s3=new AWS.S3();

const docClient=new AWS.DynamoDB.DocumentClient();

module.exports= {
    s3,
    docClient

}
