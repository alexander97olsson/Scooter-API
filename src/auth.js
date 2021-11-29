"use strict";
const database = require("../db/database.js");
const jwt = require('jsonwebtoken');

let config;

try {
    config = require("../config.json");
} catch (error) {
    console.error(error);
}

const jwtSecret = process.env.JWT_SECRET || config.secret;

const data = {
    checkToken: function checkAuth(req, res, next) {
        let token = req.headers['x-access-token'];

        if (token) {
            jwt.verify(token, jwtSecret, function(err, decoded) {
                if (err) {
                    return res.status(500).json({
                        errors: {
                            status: 500,
                            source: req.path,
                            title: "Failed authentication",
                            detail: err.message
                        }
                    });
                }

                req.user = {};
                req.user.email = decoded.email;

                return next();
            });
        } else {
            return res.status(401).json({
                errors: {
                    status: 401,
                    source: req.path,
                    title: "No token",
                    detail: "No token provided in request headers"
                }
            });
        }
    },
    login: async function(res, req) {
        if (!req.body.username) {
            return res.status(400).json({
                errors: {
                    status: 400,
                    path: "/data",
                    title: "Bad Request",
                    message: "Need Required parameters"
                }
            });
        }

        let db;
        let user;

        try {
            db = await database.getDb();
            //console.log(req.body.username);
            user = await db.userCollection.findOne({username: req.body.username});

            if (user) {
                let payload = { 
                    id: user._id,
                    username: user.username,
                };
                let jwtToken = jwt.sign(payload, jwtSecret, { expiresIn: '24h' });

                return res.json({
                    data: {
                        type: "success",
                        message: "User logged in",
                        user: payload,
                        token: jwtToken
                    }
                });
            } else {
                this.register(res, req);
            }
        } catch (e) {
            return res.status(500).json({
                errors: {
                    status: 500,
                    source: "/login",
                    title: "Database error",
                    detail: e.message
                }
            });
        } finally {
            await db.client.close();
        }
    },
    register: async function create(res, req) {
        const doc = {
            username: req.body.username,
            tag: req.body.tag,
            balance: 10000,
            trips: []
        };

        if (!req.body.tag) {
            doc.tag = "customer"
        }

        if (!req.body.username) {
            return res.status(400).json({
                errors: {
                    status: 400,
                    path: "/data",
                    title: "Bad Request",
                    message: "Need Required parameters"
                }
            });
        }

        let db;

        try {
            db = await database.getDb();
            const result = await db.userCollection.insertOne(doc);

            if (result) {
                return res.status(202).json({
                    data: result
                });
            }
        } catch (e) {
            return res.status(500).json({
                errors: {
                    status: 500,
                    path: "/data",
                    title: "Database error",
                    message: e.message
                }
            });
        } finally {
            await db.client.close();
        }
    },
};

module.exports = data;
