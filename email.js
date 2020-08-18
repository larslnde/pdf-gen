let nodemailer = require('nodemailer');
let aws = require('aws-sdk');

var pathend = 'larslnde%40gmail.com';

// configure AWS SDK
//aws.config.loadFromPath('config.json');
var credentials = new aws.SharedIniFileCredentials({profile: 'default'});
aws.config.credentials = credentials;
aws.config.region = 'eu-west-2';

// create Nodemailer SES transporter
let transporter = nodemailer.createTransport({
    SES: new aws.SES({
        apiVersion: '2010-12-01'
    })
});

// send some mail
send = transporter.sendMail({
    from: 'larslnde@gmail.com',
    to: 'larslnde@gmail.com',
    subject: 'Application recieved!',
    text: 'Thank you for applying to the openner.vc accelerator program. We will review your application and get back to you as soon as possible.',
    attachments: [
    {   // use URL as an attachment
      filename: 'YourApplication.pdf',
      path: 'https://my-pdf-demo-bucket.s3.eu-west-2.amazonaws.com/' + pathend
    },]
}, (err, info) => {
    console.log(info.envelope);
    console.log(info.messageId);
    console.log(err);
});