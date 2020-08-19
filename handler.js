'use strict';
const fs = require("fs");
const AWS = require('aws-sdk')
const PDFDocument = require("pdfkit")
const fetch = require("node-fetch");
var s3 = new AWS.S3();
var ses = new AWS.SES({region: 'eu-west-2'});

//This needs to change to generate different PDFs.
var applicantID = 'c2851670-d18c-11ea-8457-ad91a07b81c7'

exports.generatePdf = async () => {
  const key='1234.pdf'; //change this to a random filename generated from random number/text

  const pdfBuffer = await new Promise(resolve => {
    const doc = new PDFDocument()

    fetch('https://8svw2fhs59.execute-api.eu-west-2.amazonaws.com/dev/applicants/' + applicantID)
      .then(res => res.json())
      .then(dataObj => {
        generateHeader(doc)
        generateBody(doc, dataObj)
        doc.end()
        //var key = dataObj.id;
    
        const buffers = []
        doc.on("data", buffers.push.bind(buffers))
        doc.on("end", () => {
          const pdfData = Buffer.concat(buffers)
          resolve(pdfData)

          // Code for placing PDF into S3 bucket
          s3.putObject({
            Bucket: 'my-pdf-demo-bucket',
            Key: key,
            Body: pdfData,
            ContentType: "application/pdf",
            }, function (err) {
                if (err) {
                    console.log(err, err.stack);
                } else {
                    //IT DID NOT WORK HERE
                    //fetch('https://3d2zlxxvs7.execute-api.eu-west-2.amazonaws.com/dev/email');
                    console.log("Done");
                  //}  //c
                }
          });
        })
      })
  })

  fetch('https://3d2zlxxvs7.execute-api.eu-west-2.amazonaws.com/dev/email');

  const myBucket = 'https://my-pdf-demo-bucket.s3.eu-west-2.amazonaws.com/';
  var link = myBucket + key
  console.log(link)

  //Code for email below
  var params = {
    Destination: {
        ToAddresses: ["larslnde@gmail.com"]
    },
    Message: {
        Body: {
            Text: { Data: "Thank you for applying. Your application can be seen here: " + link
                
            }
        },
        
        Subject: { Data: "Application recieved!" 
        }
    },
    Source: "larslnde@gmail.com"
};

console.log("hello");

// const response = await ses.sendEmail(params).promise();
// console.log(response);

//sendEmail();

//handler = (event, context, callback) => { //c
//function sendEmail () {
  ses.sendEmail(params, function (err, data) {
      console.log("before callback")
      //callback(null, {err: err, data: data}); //c
      console.log("before if")
      if (err) {
          console.log("error happened")
          console.log(err);
          //context.fail(err); //c
      } else {
          console.log("i am here")
          console.log(data);
          //context.succeed(event); //c
      }
  });


  return {
    headers: {
      "content-type": "application/pdf",
    },
    body: pdfBuffer.toString("base64"),
    isBase64Encoded: true,
  }
}

/*exports.generatePdf = async () => {
  const pdfBuffer = await new Promise(resolve => {
    const doc = new PDFDocument()

    fetch('https://8svw2fhs59.execute-api.eu-west-2.amazonaws.com/dev/applicants/' + applicantID)
      .then(res => res.json())
      .then(dataObj => {
        generateHeader(doc)
        generateBody(doc, dataObj)
        doc.end()
        var key = dataObj.id;
    
        const buffers = []
        doc.on("data", buffers.push.bind(buffers))
        doc.on("end", () => {
          const pdfData = Buffer.concat(buffers)
          resolve(pdfData)

          // Code for placing PDF into S3 bucket
          s3.putObject({
            Bucket: 'my-pdf-demo-bucket',
            Key: key,
            Body: pdfData,
            ContentType: "application/pdf",
            }, function (err) {
                if (err) {
                    console.log(err, err.stack);
                } else {
                    console.log("Done");
                    const myBucket = 'https://my-pdf-demo-bucket.s3.eu-west-2.amazonaws.com/';
                    var link = myBucket + key

                  
                    //Code for email below
                    var params = {
                      Destination: {
                          ToAddresses: ["larslnde@gmail.com"]
                      },
                      Message: {
                          Body: {
                              Text: { Data: "Thank you for applying. Your application can be seen here: " + link
                                  
                              }
                          },
                          
                          Subject: { Data: "Application recieved!" 
                          }
                      },
                      Source: "larslnde@gmail.com"
                  };
                  
                  console.log("hello");

                  // const response = await ses.sendEmail(params).promise();
                  // console.log(response);

                  //sendEmail();

                  //handler = (event, context, callback) => { //c
                  //function sendEmail () {
                    ses.sendEmail(params, function (err, data) {
                       console.log("before callback")
                        //callback(null, {err: err, data: data}); //c
                        console.log("before if")
                        if (err) {
                            console.log("error happened")
                            console.log(err);
                            //context.fail(err); //c
                        } else {
                            console.log("i am here")
                            console.log(data);
                            //context.succeed(event); //c
                        }
                    });
                  //}  //c
                }
          });
        })
      })
  })


  return {
    headers: {
      "content-type": "application/pdf",
    },
    body: pdfBuffer.toString("base64"),
    isBase64Encoded: true,
  }
}*/


exports.test = (event, context, callback) => {
  var params = {
     Destination: {
         ToAddresses: ["larslnde@gmail.com"]
     },
     Message: {
         Body: {
             Text: { Data: "This is a test email"
                 
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


function generateHeader (doc) {
  doc
    .fontSize(20)
    .text("Application", 110, 57, { align: "middle"})
    .fontSize(10)
    .text("Contact at:", 200, 65, { align: "right" })
    .text("info@openner.vc", 200, 80, { align: "right" })
    .moveDown();
  doc
    .image('logo.png')
    .moveDown()
  doc
    .text("Accelerator program application", { align: "middle"})
}

function generateBody(doc, data) {
  doc.addPage()

  doc
    .fontSize(16)
    .text("Your application:", 50, 160);

  doc
    .fontSize(12)
    .text(`-------------`)
    .text(`Company Name: ${data.company_name}`)
    .text(`-------------`)
    .text(`Company Website: ${data.company_website}`)
    .text(`-------------`)

  doc
    
    .lineGap(1)
    .text(`Primary contact's first name: ${data.first_name}`)
    .text(`Primary contact's last name: ${data.surname}`)
    .text(`Primary contact's email address: ${data.email}`)
    .text(`Primary contact's US phone number: ${data.phone_number}`)
    .text(`What country was the company legally incorported?: ${data.incorp_country}`)
    .text(`Date of incorporation: ${data.incorp_date}`)
    .text(`Do you have operations in other countries?: ${data.operations_in_other_countries}`)
    .text(`If yes, which other countries?: ${data.optional_other_countries}`)
    .text(`What sector/category best describes your business?: ${data.sector}`)
    .text(`What is your business model?: ${data.business_model}`)
    .text(`Describe your company tweet-style (280 characters or less): ${data.describe_company}`)
    .text(`Please attach your pitch deck: ${data.pitch_deck}`)
    .text(`What stage is your company in?: ${data.company_stage}`)
    .text(`How many monthly active customers do you currently have?: ${data.monthly_users}`)
    .text(`Revenue last month(USD): ${data.revenue_1mo}`)
    .text(`Revenue 2 months ago(USD): ${data.revenue_2mo}`)
    .text(`Revenue 3 months ago(USD): ${data.revenue_3mo}`)
    .text(`Have you raised capital from investors for your startup?: ${data.raised_capital}`)
    .text(`If yes, how much capital (USD) have you raised, in what format (e.g SAFE, equity, etc), and from whom?: ${data.optional_raised_capital}`)
    .text(`Founding team size: ${data.founding_team_size}`)
    .text(`Does the founding team have majority ownership?: ${data.majority_ownership}`)
    .text(`Estimated Months of Runway: ${data.months_runway}`)
    .text(`Which countries are you targeting to expand to?: ${data.targeted_countries}`)
    .text(`What is your current growth strategy?: ${data.growth_strategy}`)
    .text(`In which industry does your target customer sit in?: ${data.industry_target_customer}`)
    .text(`Customer Focus*: ${data.customer_focus}`)
    .text(`What phase of the program are you applying for?: ${data.phase_program}`)
    .text(`What are you hoping to achieve by attending this program?: ${data.achievement_hope}`)
    .text(`How did you hear about us?: ${data.hear_about}`)
    .text(`Anything else?: ${data.anything_else}`)
    .text(`privacy_policy: ${data.timezone}`)
    .text(`timezone: ${data.privacy_policy}`)
    .text(`newsletter: ${data.newsletter}`)
    .moveDown();
}

