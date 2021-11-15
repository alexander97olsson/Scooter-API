"use strict";
const database = require("../db/database.js");
const ObjectId = require('mongodb').ObjectId;

const data = {
    getAll: async function all(res, req) {
        let db;

        try {
            db = await database.getDb();
            const result = await db.cityCollection.find().toArray();

            return res.status(200).json({ data: result });
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

            return res.status(200).json({ data: result });
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

        if (!req.body.city ||
            !req.body.part1_lat ||
            !req.body.part1_long ||
            !req.body.part2_lat ||
            !req.body.part2_long ||
            !req.body.part3_lat ||
            !req.body.part3_long ||
            !req.body.part4_lat ||
            !req.body.part4_long) {
            return res.status(400).json({
                errors: {
                    status: 400,
                    path: "/data",
                    title: "Bad Request",
                    message: "Need Required parameters"
                }
            });
        }

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
                return res.status(201).json({
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

        if (!req.body.city ||
            !req.body.part1_lat ||
            !req.body.part1_long ||
            !req.body.part2_lat ||
            !req.body.part2_long ||
            !req.body.part3_lat ||
            !req.body.part3_long ||
            !req.body.part4_lat ||
            !req.body.part4_long) {
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
                parking_zones: {
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

        if (!req.body.city ||
            !req.body.part1_lat ||
            !req.body.part1_long ||
            !req.body.part2_lat ||
            !req.body.part2_long ||
            !req.body.part3_lat ||
            !req.body.part3_long ||
            !req.body.part4_lat ||
            !req.body.part4_long) {
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
                charging_posts: {
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

        if (!req.body.city) {
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
            const result = await db.cityCollection.deleteOne(filter);

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
    updateCity: async function updateData(res, req) {
        const filter = { city: req.body.city };
        const doc = {
            amount_of_bikes: parseInt(req.body.amount_of_bikes)
        }
        if (!req.body.city || !req.body.amount_of_bikes) {
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
            const result = await db.cityCollection.updateOne(filter, {$set: doc});

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
    }
};

module.exports = data;
