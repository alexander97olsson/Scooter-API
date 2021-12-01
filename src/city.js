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
            !req.body.part1_lng ||
            !req.body.part2_lat ||
            !req.body.part2_lng ||
            !req.body.part3_lat ||
            !req.body.part3_lng ||
            !req.body.part4_lat ||
            !req.body.part4_lng) {
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
                    lat: parseFloat(req.body.part1_lat),
                    lng: parseFloat(req.body.part1_lng)
                },
                polygonePart2: {
                    lat: parseFloat(req.body.part2_lat),
                    lng: parseFloat(req.body.part2_lng)
                },
                polygonePart3: {
                    lat: parseFloat(req.body.part3_lat),
                    lng: parseFloat(req.body.part3_lng)
                },
                polygonePart4: {
                    lat: parseFloat(req.body.part4_lat),
                    lng: parseFloat(req.body.part4_lng)
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
            !req.body.amount_of_bikes ||
            !req.body.part1_lat ||
            !req.body.color ||
            !req.body.part1_lng ||
            !req.body.part2_lat ||
            !req.body.part2_lng ||
            !req.body.part3_lat ||
            !req.body.part3_lng ||
            !req.body.part4_lat ||
            !req.body.part4_lng) {
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
                    amount_of_bikes_zone: parseFloat(req.body.amount_of_bikes),
                    color: req.body.color,
                    position: {
                        polygonePart1: {
                            lat: parseFloat(req.body.part1_lat),
                            lng: parseFloat(req.body.part1_lng)
                        },
                        polygonePart2: {
                            lat: parseFloat(req.body.part2_lat),
                            lng: parseFloat(req.body.part2_lng)
                        },
                        polygonePart3: {
                            lat: parseFloat(req.body.part3_lat),
                            lng: parseFloat(req.body.part3_lng)
                        },
                        polygonePart4: {
                            lat: parseFloat(req.body.part4_lat),
                            lng: parseFloat(req.body.part4_lng)
                        }
                    }
                }
            }
        };
        let db;

        try {
            db = await database.getDb();
            await db.cityCollection.updateOne(filter, updateDoc);

            return res.status(200).json({
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
    updateZones: async function updateZone(res, req) {

        if (!req.body.color ||
            !req.body.amount_of_bikes ||
            !req.body.city) {
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
            await db.cityCollection.updateOne({ city: req.body.city, "parking_zones.color": req.body.color },
            { $set: { "parking_zones.$.amount_of_bikes_zone" : parseFloat(req.body.amount_of_bikes) } });

            return res.status(200).json({
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
            !req.body.amount_of_bikes ||
            !req.body.color ||
            !req.body.part1_lat ||
            !req.body.part1_lng ||
            !req.body.part2_lat ||
            !req.body.part2_lng ||
            !req.body.part3_lat ||
            !req.body.part3_lng ||
            !req.body.part4_lat ||
            !req.body.part4_lng) {
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
                    amount_of_bikes_post: parseFloat(req.body.amount_of_bikes),
                    color: req.body.color,
                    position: {
                        polygonePart1: {
                            lat: parseFloat(req.body.part1_lat),
                            lng: parseFloat(req.body.part1_lng)
                        },
                        polygonePart2: {
                            lat: parseFloat(req.body.part2_lat),
                            lng: parseFloat(req.body.part2_lng)
                        },
                        polygonePart3: {
                            lat: parseFloat(req.body.part3_lat),
                            lng: parseFloat(req.body.part3_lng)
                        },
                        polygonePart4: {
                            lat: parseFloat(req.body.part4_lat),
                            lng: parseFloat(req.body.part4_lng)
                        }
                    }
                }
            }
        };
        let db;

        try {
            db = await database.getDb();
            await db.cityCollection.updateOne(filter, updateDoc);

            return res.status(200).json({
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
    updatePosts: async function updatePost(res, req) {

        if (!req.body.color ||
            !req.body.amount_of_bikes ||
            !req.body.city) {
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
            await db.cityCollection.updateOne({ city: req.body.city, "charging_posts.color": req.body.color },
            { $set: { "charging_posts.$.amount_of_bikes_post" : parseFloat(req.body.amount_of_bikes) } });

            return res.status(200).json({
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
                return res.status(200).json({
                    data: {
                        result: `Object: ${req.body._id} deleted`
                    }
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
                return res.status(200).json({
                    data: {
                        result: `Object: ${req.body._id} updated`
                    }
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
    getZonesInCity: async function allZonesInCity(res, req) {
        let db;
        try {
            db = await database.getDb();
            const result = await db.cityCollection.findOne({city:req.params.city});

            return res.status(200).json({ data: result.parking_zones });
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
    getPostsInCity: async function allPostsInCity(res, req) {
        let db;
        try {
            db = await database.getDb();
            const result = await db.cityCollection.findOne({city:req.params.city});

            return res.status(200).json({ data: result.charging_posts });
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
