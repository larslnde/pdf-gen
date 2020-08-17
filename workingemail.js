'use strict';
var aws = require('aws-sdk');
var ses = new aws.SES();
var s3 = new aws.S3();
aws.config.region = 'eu-west-2'

function getS3File(bucket, key) {
  return new Promise(function(resolve, reject) {
      s3.getObject(
          {
              Bucket: bucket,
              Key: key
          },
          function (err, data) {
              if (err) return reject(err);
              else return resolve(data);
          }
      );
  })
}

// Both must (currently) be confirmed in the aws sandbox
const sender = "larslnde@gmail.com";
const recipient = "larslnde@gmail.com";

// The subject line for the email.
const subject = "Application for Openner.vc Accelerator recieved.";

// The email body for recipients with non-HTML email clients.
const body_text = "Hello,\r\n"
                + "Thank for you applying to the accelerator program, "
                + "we have attached your application below.\n"
                + "We are currently reviewing your application "
                + "and will get back to you as soon as possible."
            
// The HTML body of the email.
const body_html = `<html>
<head></head>
<body>
  <h1>Openner.vc</h1>
  <p>
  Thank for you applying to the accelerator program, we have attached your application below.<br>
  We are currently reviewing your application and will get back to you as soon as possible.</p>
</body>
</html>`;

// The character encoding for the email.
const charset = "UTF-8";


// Specify the parameters to pass to the API.
var params = { 
  Source: sender, 
  Destination: { 
    ToAddresses: [
      recipient 
    ],
  },
  Message: {
    Subject: {
      Data: subject,
      Charset: charset
    },
    Body: {
      Text: {
        Data: body_text,
        Charset: charset 
      },
      Html: {
        Data: body_html,
        Charset: charset
      },
      // Attachment: {
      //   Data: getS3File('my-pdf-demo-bucket', 'larslnde@gmail.com')
      // }
    }
  },
};

//Try to send the email.
ses.sendEmail(params, function(err, data) {
  // If something goes wrong, print an error message.
  if(err) {
    console.log(err.message);
  } else {
    console.log("Email sent! Message ID: ", data.MessageId);
  }
});