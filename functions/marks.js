'use strict';
const express = require('express');
const serverless = require('serverless-http');
const bodyParser = require('body-parser');
const moment = require('moment');
const { MongoClient } = require("mongodb");
const xlsx = require('node-xlsx');
const app = express();

const mongoClient = new MongoClient(process.env.MONGO_URL);
const clientPromise = mongoClient.connect();

app.post('/.netlify/functions/marks/process', bodyParser.json(), async function (req, res) {
    const result = convertDataToWorksheet(req);
    console.log(result);
    res.status(result ? result.status ? result.status : 500 : 500).json(result ? result.response ? result.response : {} : {});
});

//Convert dataset to a worksheet
function convertDataToWorksheet(req) {
    try {
        const arr = [];
        Object.keys(req.body.content).forEach(k => { arr.push(req.body.content[k]) });
        const [worksheet] = xlsx.parse(Buffer.from(arr));
        return {response: worksheet, status: 200};
    } catch (e) {
        console.log(e);
        return null;
    }
}

// //Convert dataset to a worksheet
// function convertDataToWorksheet(req) {
//     try {
//         const arr = [];
//         Object.keys(req.body.content).forEach(k => { arr.push(req.body.content[k]) });
//         const [worksheet] = xlsx.parse(Buffer.from(arr));
//         const prices = {};
//         prices.configurations = [];
//         prices.rows = [];
//         prices.prices = {};

//         //Add Data
//         worksheet.data.forEach((row, i) => {
//             if (row.length > 0) {
//                 if (i === 1) {
//                     //configurations
//                     delete row[0];
//                     delete row[1];
//                     delete row[2];
//                     row.forEach((r, i) => {
//                         prices.configurations.push(r)
//                     });
//                 } else if (i > 1) {
//                     if (row.length > 0) {
//                         //Rows
//                         let product = Array(prices.configurations.length);
//                         product.fill(' ');
//                         row.map((c, i) => product[i] = c);
//                         prices.rows.push(product);

//                         prices.configurations.forEach((column, i) => {
//                             prices.prices[`${row[1]}_${column}`] = { price: (row[i + 3] == '' || row[i + 3] == 0 || row[i + 3] == undefined) ? 0 : row[i + 3], product_code: row[1], configuration_code: column };
//                         });
//                     }
//                 }
//             }
//         });
//         return prices;
//     } catch (e) {
//         return null;
//     }
// }

exports.handler = serverless(app);