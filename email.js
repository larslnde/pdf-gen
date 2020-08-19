// Copyright 2019 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0


var aws = require('aws-sdk');
var ses = new aws.SES({region: 'eu-west-2'});

var key = "readInFromHandler"
const myBucket = 'https://my-pdf-demo-bucket.s3.eu-west-2.amazonaws.com/';
var link = myBucket + key

exports.handler = (event, context, callback) => {
     var params = {
        Destination: {
            ToAddresses: ["larslnde@gmail.com"]
        },
        Message: {
            Body: {
                Text: { Data: "this is a test email"
                    
                }
            },
            
            Subject: { Data: "Application recieved!" 
            }
        },
        Source: "larslnde@gmail.com"
    };

     ses.sendEmail(params, function (err, data) {
        callback(null, {err: err, data: data});
        if (err) {
            console.log(err);
            context.fail(err);
        } else {
            
            console.log(data);
            context.succeed(event);
        }
    });
};