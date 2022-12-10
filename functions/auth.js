'use strict';
const express = require('express');
const jwt = require('jsonwebtoken');
var crypto = require("crypto");
const serverless = require('serverless-http');
const bodyParser = require('body-parser');
const moment = require('moment');
const { MongoClient } = require("mongodb");
const app = express();

const mongoClient = new MongoClient(process.env.MONGO_URL);
const clientPromise = mongoClient.connect();

app.post('/.netlify/functions/auth/google', bodyParser.json(), async function (req, res) {
    const result = await exports.saveUser({ sub: req.body.sub, name: req.body.name, email: req.body.email });
    res.status(result ? result.status ? result.status : 500 : 500).json(result ? result.response ? result.response : {} : {});
});

exports.saveUser = async (user) => {
    try {
        const database = (await clientPromise).db(process.env.MONGO_DB);
        const result = await database.collection('user').findOne({ email: user.email });
        let token = null;
        let insertedU = null;
        if (!result) {
            insertedU = await database.collection('user').insertOne(user);
            token = await new Promise((resolve, reject) => {
                jwt.sign({ user: { id: insertedU.insertedId.toString(), name: user.name, email: user.email, created: moment(new Date()).format('YYYY-MM-DD') } }, process.env.SECRET, { expiresIn: '24h' }, (err, token) => {
                    resolve(token);
                })
            });
        } else {
            token = await new Promise((resolve, reject) => {
                jwt.sign({ user: result }, process.env.SECRET, { expiresIn: '24h' }, (err, token) => {
                    resolve(token);
                })
            });
        }
        return { status: 200, response: { data: { status: 'success', token: token, user: result ? result : user }, error: null } };
    } catch (e) {
        console.log(e);
        return { status: 500, response: { data: null, error: e } };
    }
};

exports.verifyToken = function (req, res, next) {
    try {
        const bearerHeader = req.headers.authroization;
        if (typeof bearerHeader !== 'undefined') {
            const bearer = bearerHeader.split(' ');
            const bearerToken = bearer[1];
            jwt.verify(bearerToken, process.env.SECRET);
            next();
        } else {
            throw { status: 403, message: 'Access Denied' };
        }
    } catch (e) {
        if (e.name === 'TokenExpiredError') {
            res.status(500).json({ data: null, error: 'Token Expired' });
        } else {
            console.log(e);
            res.status(e.status).json({ data: null, error: e.message });
        }
    }
}

exports.getUserDataFromToken = function (req) {
    try {
        const bearerHeader = req.headers.authroization;
        if (typeof bearerHeader !== 'undefined') {
            const bearer = bearerHeader.split(' ');
            const bearerToken = bearer[1];
            const data = jwt.verify(bearerToken, process.env.SECRET);
            return data;
        } else
            return null;
    } catch (e) {
        console.log(e);
        return null;
    }
}

exports.handler = serverless(app);