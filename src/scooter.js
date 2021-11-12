"use strict";
const database = require("../db/database.js");
const ObjectId = require('mongodb').ObjectId;

const data = {
    getAll: async function all(res, req) {
        let db;

        try {
            db = await database.getDb();
            const result = await db.collection.find().toArray();

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
            const result = await db.collection.find({_id:ObjectId(req.params.id)}).toArray();

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
    createScooter: async function create(res, req) {
        const doc = {
            active_user: null,
            city_location: req.body.city_location,
            position: {
                lat: req.body.lat,
                long: req.body.long
            },
            battery: 100,
            is_active: false,
            speed: 0,
            start_time: null,
            logg: []
        };

        let db;

        try {
            db = await database.getDb();
            const result = await db.collection.insertOne(doc);

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
    deleteScooter: async function remove(res, req) {
        const filter = { _id: ObjectId(req.body._id) };
        let db;
        try {
            db = await database.getDb();
            const result = await db.collection.deleteOne(filter);

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
    updateScooter: async function updateData(res, req) {
        const filter = { _id: ObjectId(req.body._id) };
        const doc = {
            active_user: req.body.user,
            battery: req.body.battery,
        };
        let db;

        try {
            db = await database.getDb();
            await db.collection.updateOne(filter, {$set: doc});

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
    insertLogg: async function log(res, req) {
        const filter = { _id: ObjectId(req.body._id) };
        let updateDoc = {
            $push: {
                logg: {
                    user: req.body.active_user,
                    start: {
                        position: {
                            lat: req.body.start_lat,
                            long: req.body.start_long
                        },
                        time: req.body.start_time
                    },
                    end: {
                        position: {
                            lat: req.body.start_lat,
                            long: req.body.start_long
                        },
                        time: req.body.end_time
                    }
                }
            }
        };
        let db;

        try {
            db = await database.getDb();
            await db.collection.updateOne(filter, updateDoc);

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
    updateUserInfo: async function user(res, req) {
        const filter = { _id: ObjectId(req.body._id) };
        let doc = {
            active_user: req.body.active_user,
            is_active: req.body.is_active
        };
        let db;

        try {
            db = await database.getDb();
            await db.collection.updateOne(filter, {$set: doc});

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
    }
};

module.exports = data;
