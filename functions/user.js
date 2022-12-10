'use strict';
const express = require('express');
const serverless = require('serverless-http');
const bodyParser = require('body-parser');
const moment = require('moment');
const { MongoClient } = require("mongodb");
const app = express();
const auth = require('./auth');

const mongoClient = new MongoClient(process.env.MONGO_URL);
const clientPromise = mongoClient.connect();

app.get('/.netlify/functions/user/email', bodyParser.json(), async function (req, res) {
    const result = await exports.getUserDetails(req, res);
    res.status(result ? result.status ? result.status : 500 : 500).json(result ? result.response ? result.response : {} : {});
});

exports.getUserDetails = async (req) => {
    try {
        const data = auth.getUserDataFromToken(req);
        if (data) {
            const database = (await clientPromise).db(process.env.MONGO_DB);
            return await database.collection('user').findOne({ "email": data.user.email });
        }
    } catch (e) {
        console.log(e);
        return { status: 500, response: { data: null, error: err } };
    }
}

exports.handler = serverless(app);