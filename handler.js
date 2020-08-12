'use strict';
const fs = require("fs");
const PDFDocument = require("pdfkit")
const axios = require('axios');
const { getHeapCodeStatistics } = require("v8");

var applicantID = '50726520-dbd6-11ea-95c1-fd48d42f0d8d'

var data = {
  company_name: "test",
  company_website: "test",
  first_name: "test",
  surname: "test",
  email: "test",
  phone_number: "test",
  incorp_country: "test",
  incorp_date: "test",
  operations_in_other_countries: "test",
  optional_other_countries: "test",
  sector: "test",
  business_model: "test",
  describe_company: "test",
  pitch_deck: "test",
  company_stage: "test",
  monthly_users: "test",
  revenue_1mo: "test",
  revenue_2mo: "test",
  revenue_3mo: "test",
  raised_capital: false,
  optional_raised_capital: "test",
  founding_team_size: "test",
  majority_ownership: false,
  months_runway: "test",
  targeted_countries: "test",
  growth_strategy: "test",
  industry_target_customer: "test",
  customer_focus: "test",
  achievement_hope: "test",
  hear_about: "test",
  anything_else: "test",
  phaseType: "test",
  timezone: false,
  privacy_policy: false, 
  newsletter: false,
};

var dataobj;

exports.generatePdf = async () => {
  const pdfBuffer = await new Promise(resolve => {
    const doc = new PDFDocument()

    fetch('https://8svw2fhs59.execute-api.eu-west-2.amazonaws.com/dev/applicants/' + applicantID)
      .then(res => res.json())
      .then(dataObj => {
        generateHeader(doc)
        generateBody(doc, dataObj)
    
        doc.end()
    
        const buffers = []
        doc.on("data", buffers.push.bind(buffers))
        doc.on("end", () => {
          const pdfData = Buffer.concat(buffers)
          resolve(pdfData)
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
}

function generateHeader (doc) {
  doc
    .fontSize(20)
    .text("Openner.vc Application", 110, 57, { align: "middle"})
    .fontSize(10)
    .text("Contact at:", 200, 65, { align: "right" })
    .text("info@openner.vc", 200, 80, { align: "right" })
    .moveDown();
}

function generateBody(doc, data) {
  doc
    .fontSize(16)
    .text("Your application:", 50, 160);

  doc
    .fontSize(12)
    .text(`Company Name: ${data.company_name}`)
    .text(`Company Website: ${data.company_website}`)
    .text(`Primary contact's first name: ${data.first_name}`)
    .text(`Primary contact's last name:: ${data.surname}`)
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

