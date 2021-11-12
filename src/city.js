"use strict";
const database = require("../db/database.js");
const ObjectId = require('mongodb').ObjectId;

const data = {
    getAll: async function all(res, req) {
        let db;

        try {
            db = await database.getDb();
            const result = await db.cityCollection.find().toArray();

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
            const result = await db.cityCollection.find({city:req.params.city}).toArray();

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
    createCity: async function create(res, req) {
        const doc = {
            city: req.body.city,
            amount_of_bikes: 0,
            position: {
                polygonePart1: {
                    lat: req.body.part1_lat,
                    long: req.body.part1_long
                },
                polygonePart2: {
                    lat: req.body.part2_lat,
                    long: req.body.part2_long
                },
                polygonePart3: {
                    lat: req.body.part3_lat,
                    long: req.body.part3_long
                },
                polygonePart4: {
                    lat: req.body.part4_lat,
                    long: req.body.part4_long
                }
            },
            parking_zones: [],
            charging_posts:  []
        };

        let db;

        try {
            db = await database.getDb();
            const result = await db.cityCollection.insertOne(doc);

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
    insertZones: async function zones(res, req) {
        const filter = { city: req.body.city };
        let updateDoc = {
            $push: {
                parking_zones: {
                    position: {
                        lat: req.body.lat,
                        long: req.body.long
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
    insertPosts: async function posts(res, req) {
        const filter = { city: req.body.city };
        let updateDoc = {
            $push: {
                charging_posts: {
                    position: {
                        lat: req.body.lat,
                        long: req.body.long
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
    deleteCity: async function remove(res, req) {
        const filter = { city: req.body.city };
        let db;
        try {
            db = await database.getDb();
            const result = await db.cityCollection.deleteOne(filter);

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
    updateCity: async function updateData(res, req) {
        const filter = { city: req.body.city };
        const doc = {
            amount_of_bikes: parseInt(req.body.amount_of_bikes)
        }
        let db;
        try {
            db = await database.getDb();
            const result = await db.cityCollection.updateOne(filter, {$set: doc});

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
    }
};

module.exports = data;
