// Copyright 2019 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

//var link = 

var aws = require('aws-sdk');
var ses = new aws.SES({region: 'eu-west-2'});

exports.handler = (event, context, callback) => {
    
     var params = {
        Destination: {
            ToAddresses: ["larslnde@gmail.com"]
        },
        Message: {
            Body: {
                Text: { Data: "Thank you for applying. Your application can be seen here: " //+ link
                    
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