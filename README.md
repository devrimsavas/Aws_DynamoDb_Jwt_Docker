

# AWS DYNAMO DB TUTORIAL  WITH JWT 
- We create two tables in same database: 
    - table userTable for user operation 
    - table UserCredentials for login and sign-up 
    - user can access userTable operations after log-in 
    - implantation of JWT is given second part of this tutorial. 

# 1- Create a Dynamo DB in AWS 

you'll need to create a table in AWS DynamoDB. Here’s a high-level overview of the steps you'll need to follow to get started with DynamoDB:

- 1-  Sign In to AWS Management Console: Log into the AWS Management Console with your AWS account.
- 2-  Navigate to DynamoDB: In the AWS Management Console, find and select DynamoDB under the database services category.
        https://eu-north-1.console.aws.amazon.com/dynamodbv2/home?region=eu-north-1#service 
- 3-  Create a Table:
    - - Click the “Create table” button.
    - - Enter a name for your table. This is how your application will refer to it.
    - - Define a primary key for your table. The primary key uniquely identifies each item in the table, so it's important to choose the key that suits your data. You can choose a simple primary key (partition key) or a composite primary key (partition key and sort key).

    - - Configure additional settings as necessary, such as secondary indexes (which allow you to query the data in different ways), auto scaling, encryption, and more.

- 4 Table Settings:
   - -  You can customize read/write capacity modes, manage secondary indexes, set up stream settings if you want to capture changes to your table, and configure backup and restore settings.

   - -  DynamoDB offers two capacity modes: On-demand and Provisioned. On-demand automatically adjusts capacity to maintain performance as request volumes change, while Provisioned requires you to specify the amount of read and write throughput that you expect your application to require.

 
- 5 Review and Create: Review all settings and configurations, then click “Create” to establish your DynamoDB table.
Access and Manage Data: Once your table is created, you can start accessing and managing data through the AWS Management Console, or programmatically via the AWS SDKs in your application.


 When your table is ready, you can integrate it into your application using the AWS SDK. This will allow you to perform operations like creating, reading, updating, and deleting items in your DynamoDB table directly from your application 


 # 2- Install and Dynamo CRUD operation 
-  Install the dotenv and @cyclic.sh/dynamodb packages with the commands if you use cyclic:
 ``` bash 

 npm i dotenv
 npm i '@cyclic.sh/dynamodb'
 ``` 
- Install AWS if you use Render 
```bash 
npm install aws-sdk
```
 * Important note: Since cyclic is still down , we will use RENDER , so we do not need to install 
 ```bash 
 npm i '@cyclic.sh/dynamodb' 
 ``` 
 for this project: 
 - however the reason why we need it ?
- - The package @cyclic.sh/dynamodb  is typically used when working with DynamoDB, but it's specifically tailored for integration with Cyclic, a serverless app hosting platform. This package is a wrapper around AWS DynamoDB operations, providing simplified methods to perform CRUD (Create, Read, Update, Delete) operations on your DynamoDB tables. It likely includes additional functionalities or configurations that are optimized for use within the Cyclic platform

- WHY use ` @cyclic.sh/dynamodb?
- - Simplified API: The wrapper provides a more straightforward and possibly more intuitive API for interacting with DynamoDB. This can make your code cleaner and easier to maintain.
- - Integration with Cyclic: If you are hosting your application on Cyclic, using their specific package might provide better integration with the platform's other features and optimizations.
- - Additional Features: Such packages often include enhancements like easier connection setups, handling of retries, or other utility features that are not directly provided by the standard AWS SDK.


### Should we use @cyclic.sh/dynamodb
- If you are using Cyclic: It makes sense to use this package as it likely offers optimizations and enhancements tailored to the Cyclic environment.
- If you are not using Cyclic: You might be better off using the official AWS SDK (aws-sdk) for Node.js. This ensures you have full control over all features provided by AWS without any additional abstraction or dependency on third-party packages unless you specifically require the features they offer.

- For projects not hosted on Cyclic or if you want the most direct control over AWS services, sticking with the official aws-sdk is generally advisable. This approach ensures compatibility with AWS updates and direct support from AWS documentation and community resources.



## Local and Deployement Security 
- Locally: If you're developing locally, you can also use the AWS CLI to configure your credentials securely. Run aws configure and input your credentials, which will be stored in ~/.aws/credentials. Your application can then use the default credential provider chain to access these securely.
- n Production: Use secrets management tools provided by your hosting service or third-party tools like HashiCorp Vault to manage and inject credentials into your application securely.

## Configure AWS CLI 
```bash 
aws configure
```
- This command will prompt you to enter your AWS Access Key ID, Secret Access Key, default region, and output format. It stores the credentials in a file that the AWS SDK can automatically use, which is safer than storing them in plain text in your environment.


# CREATE a Dynamo DB table 

- BEFORE you create table "be sure your policy has 
```bash 
AmazonDynamoDBFullAccess
``` 

- 1 Access DynamoDB in AWS Console:
    - Go to the AWS Management Console.
    - Open the DynamoDB service page.
- 2 Create a New Table 
    - Click on the “Create table” button.
    - Table name: Give your table a name that easily identifies its purpose, like UserInfo.
    - Primary key: Decide on the primary key for your table. For user data, typically, email could be a good choice as it is unique for each user. You could set email as the partition key.

- 3 Define Attributes 
    - While DynamoDB is schema-less for the attributes (other than the primary key), meaning you can store any additional data as needed, you must define the primary key. For your application, define the primary key as mentioned, and you can save name, surname, and age dynamically.

- 4 Set Throughput Settings:
    -You can choose between Provisioned and On-demand capacity modes. On-demand is easier to manage as it scales automatically and you pay per request, which might be preferable for a new application without     predictable traffic.
- 5  Additional Settings (Optional):
    - Secondary Indexes: If you think you'll need to query your table by fields other than the primary key (e.g., surname), consider setting up secondary indexes.
    - Auto Scaling: If you choose provisioned capacity, consider enabling auto-scaling to adjust capacity based on actual usage.
    - Encryption, Tags, and Backups: Set up these options based on your security and operational requirements.
- 6 Create the Table:
Review all the settings, then click “Create”. It will take a few moments for AWS to provision the table and make it available for use.


# CONFIG FILE 
- we need initialize AWS configuration file including Dynamo DB 

```bash 

const AWS = require('aws-sdk');

AWS.config.update({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

const docClient = new AWS.DynamoDB.DocumentClient();

module.exports = { s3, docClient }; // Export both S3 and DocumentClient

```
