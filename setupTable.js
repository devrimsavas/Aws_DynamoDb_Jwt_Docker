/* IMPORTANT 

******************
*/


// this code was not used in this project
// setup the dynamo db table environment variables

const AWS=require('aws-sdk');
require('dotenv').config();
const docClient=new AWS.DynamoDB.DocumentClient(); //new dynamodb object

//add any AWS OBJECTS here
const s3=new AWS.S3(); 
//more and more whatver we will use



//create table 

let params = {
    TableName : "user_info_table",
    KeySchema: [       
        { AttributeName: "email", KeyType: "HASH"},  //Partition key
    ],
    AttributeDefinitions: [       
        { AttributeName: "email", AttributeType: "S" },
    ],
    ProvisionedThroughput: {       
        ReadCapacityUnits: 10, 
        WriteCapacityUnits: 10
    }
};

docClient.createTable(params, function(err, data) {
    if (err) console.error("Unable to create table. Error JSON:", JSON.stringify(err, null, 2));
    else console.log("Created table. Table description JSON:", JSON.stringify(data, null, 2));
});


//insert items 
let putParams = {
    TableName: "user_info_table",
    Item: {
        email: "example@example.com",  // This must match the primary key schema
        name: "John",
        surname: "Doe",
        age: "30"
    }
};

docClient.put(putParams, function(err, data) {
    if (err) console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));
    else console.log("Added item:", JSON.stringify(data, null, 2));
});
