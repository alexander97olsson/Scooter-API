"use strict";
const database = require("../db/database.js");
const ObjectId = require('mongodb').ObjectId;

const data = {
    getAll: async function all(res, req) {
        let db;

        try {
            db = await database.getDb();
            const result = await db.userCollection.find().toArray();

            return res.status(201).json({ data: result });
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
    getOne: async function one(res, req) {
        let db;
        try {
            db = await database.getDb();
            const result = await db.userCollection.find({_id:ObjectId(req.body._id)}).toArray();

            return res.status(201).json({ data: result });
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
    createUser: async function create(res, req) {
        const doc = {
            tag: req.body.tag,
            first_name: req.body.first_name,
            sur_name: req.body.sur_name,
            email: req.body.email,
            balance: req.body.email,
            trips: []
        };

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
    insertTrip: async function add(res ,req) {
        const filter = { city: req.body.id };

        if (!req.body.id ||
            !req.body.trip_id ||
            !req.body.date ||
            !req.body.price ||
            !req.body.start_lat ||
            !req.body.start_lng ||
            !req.body.start_time ||
            !req.body.stop_lat ||
            !req.body.stop_lng ||
            !req.body.stop_time) {
            return res.status(400).json({
                errors: {
                    status: 400,
                    path: "/data",
                    title: "Bad Request",
                    message: "Need Required parameters"
                }
            });
        }

        let updateDoc = {
            $push: {
                trips: {
                    id: req.body.trip_id,
                    date: req.body.date,
                    price: req.body.price,
                    start: {
                        position: {
                            lat: parseFloat(req.body.start_lat),
                            lng: parseFloat(req.body.start_lng)
                        },
                        time: req.body.start_time
                    },
                    stop: {
                        position: {
                            lat: parseFloat(req.body.stop_lat),
                            lng: parseFloat(req.body.stop_lng)
                        },
                        time: req.body.stop_time
                    }
                }
            }
        };
        let db;

        try {
            db = await database.getDb();
            await db.cityCollection.updateOne(filter, updateDoc);

            return res.status(204).json({
                data: {
                    result: `Object: ${req.body._id} updated`
                }
            });
            
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
    deleteUser: async function remove(res, req) {
        const filter = { city: req.body.id };

        if (!req.body.id) {
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
            const result = await db.userCollection.deleteOne(filter);

            if (result) {
                return res.status(204).json({
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
