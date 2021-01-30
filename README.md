# aws-lambda-to-s3
Sample project to show how to upload a PDF file to an Amazon S3 bucket using AWS Lambda

### Prerequisites
- You will need the lambda deployed to AWS and have the url to it handy. see `src/lambda/README.md` for more information.

### Installation
clone:
- `git clone git@github.com:TravisBallard/aws-lambda-to-s3.git`

install dependencies and run dev server: 
- `yarn install`

Create and edit .env file
- `touch .env && echo "SNOWPACK_PUBLIC_UPLOAD_ENDPOINT=\"https://my.aws-endpoint.com\"" > .env`

- Open .env and replace `https://my.aws-endpoint.com` with the URL to your AWS lambda function

Run dev server
- `yarn dev`

OR build
- `yarn build`
