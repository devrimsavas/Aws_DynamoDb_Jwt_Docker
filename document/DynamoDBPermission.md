
# Steps to Add DynamoDB Permissions to Existing IAM User
- 1 Log into AWS Management Console:
    - - Navigate to the AWS Management Console and open the IAM (Identity and Access Management) service.

- 2 Find and Select the IAM User:
    - - In the IAM dashboard, click on “Users”.
    - - Search for and select the user devrimsavas from the list.

- 3 Manage Permissions for the User:
    - - On the user details page, you will see a tab for "Permissions". Here, you can manage the policies attached to the user.
    - -Click on “Add permissions” to either attach existing policies or create a new policy.


- 4 Attach an Existing Policy or Create a New One:
     - - Attach Existing Policy: If a suitable policy that includes the necessary DynamoDB permissions exists, you can attach it. For example, 
     
    ``` bash AmazonDynamoDBFullAccess ```
    is an AWS managed policy that grants extensive permissions for DynamoDB. This can be useful for development, but it's broad and not recommended for production environments.

    - - Create a Custom Policy: If you need more restrictive permissions, consider creating a custom policy:
    - - - Select “Create policy”.
    - - - Set DynamoDB as the service, and specify the actions (e.g., PutItem, GetItem, UpdateItem, etc.).
    - - - Define the resource scope—either all resources or specify particular tables by their ARNs.
     - - - Review and name your policy, then create it.

     - - - Return to the user's permissions page, click “Attach policies”, and select your newly created policy.

 - 5 Review and Confirm:
- After attaching the necessary policies, double-check the permissions list to ensure the user now has the correct access levels to perform the required DynamoDB operations.
- This is a good time to review all attached policies to ensure there are no excessive permissions that violate the principle of least privilege.
- 6 Test the Configuration:
Once the permissions are updated, test to ensure that your application can now successfully perform DynamoDB operations without encountering authorization errors.
By managing IAM permissions in this way, you ensure that your IAM users have precisely the access they need to perform their tasks, enhancing security and compliance in your AWS environment. This method also helps you keep your AWS account organized and reduces the likelihood of errors related to having too many users with overlapping responsibilities.