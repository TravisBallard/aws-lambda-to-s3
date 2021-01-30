### Lambda to create pre-signed upload url for a PDF file 

This Lambda function creates a pre-signed url for you to upload your pdf file to.

### Deploying with [Serverless](https://serverless.com/framework/docs/)
 
- Create a new IAM user group called LambdaS3Access `https://console.aws.amazon.com/iam/home?#/groups`

- Attach the following existing policies to your new LambdaS3Access group: `IAMFullAccess`, `AmazonS3FullAccess`, `CloudWatchLogsFullAccess`, `AmazonAPIGatewayAdministrator`, `AWSCloudFormationFullAccess`, `AWSLambda_FullAccess`

- Create a new user with Programmatic Access and add it to our LambdaS3Access group. `https://console.aws.amazon.com/iam/home?#/users`

- Go to Roles in your IAM console and then select the lambdaRole that is listed. Should look like `lambda-dev-us-west-1-lambdaRole` assuming you are using the `us-west-1` region. Attach the `AmazonS3FullAccess` policy to this role.

- Configure Serverless to use the Access key ID and Secret Access Key that was generated when you created your user `serveress config credentials --provider aws --key YOUR_ACCESS_KEY_ID --secret YOUR_SECRET_ACCESS_KEY`

- Edit `serverless.yml` and make sure that the region is the same as the one your lambda is in. By default we use `us-west-1`

- Edit `handler.js` and change line 12 to the name of the S3 bucket you want to upload to. If you don't have one, you'll want to create one now. 

- in the s3 console, browse to your new bucket and click on the 'permissions' tab and then scroll down to the CORS section and apply the following configuation 
```
[
    {
        "AllowedHeaders": [
            "*"
        ],
        "AllowedMethods": [
            "HEAD",
            "GET",
            "PUT",
            "POST",
            "DELETE"
        ],
        "AllowedOrigins": [
            "http://localhost:8080"
        ],
        "ExposeHeaders": [
            "x-amz-server-side-encryption",
            "x-amz-request-id",
            "x-amz-id-2"
        ],
        "MaxAgeSeconds": 3000
    }
]
```

- Deploy to AWS using Serverless by typing the command `serverless deploy`

- Take note of the `GET` endpoint that is created and add that to your projects `.env` file as `SNOWPACK_PUBLIC_UPLOAD_ENDPOINT`

---

### 403 errors on upload? 
##### double check your IAM roles and permissions on your S3 bucket and your lambda execution role. It is usually related to this. 