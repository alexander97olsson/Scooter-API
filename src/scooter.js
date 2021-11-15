"use strict";
const database = require("../db/database.js");
const ObjectId = require('mongodb').ObjectId;

const data = {
    getAll: async function all(res, req) {
        let db;

        try {
            db = await database.getDb();
            const result = await db.collection.find().toArray();

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
        if (!req.body.city_location || !req.body.lat || !req.body.long) {
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
    deleteScooter: async function remove(res, req) {
        const filter = { _id: ObjectId(req.body._id) };

        if (!req.body._id) {
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
            const result = await db.collection.deleteOne(filter);

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
    updateScooter: async function updateData(res, req) {
        const filter = { _id: ObjectId(req.body._id) };

        if (!req.body._id || !req.body.battery || !req.body.speed) {
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
            battery: parseFloat(req.body.battery),
            speed: parseFloat(req.body.speed),
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
    startScooter: async function start(res, req) {
        const filter = { _id: ObjectId(req.body._id) };

        if (!req.body._id || !req.body.start_time) {
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
            start_time: req.body.start_time,
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

        if (!req.body._id ||
            !req.body.active_user ||
            !req.body.start_lat ||
            !req.body.start_long ||
            !req.body.start_time ||
            !req.body.end_lat ||
            !req.body.end_long ||
            !req.body.end_time) {
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
                            lat: req.body.end_lat,
                            long: req.body.end_long
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

        if (!req.body._id) {
            return res.status(400).json({
                errors: {
                    status: 400,
                    path: "/data",
                    title: "Bad Request",
                    message: "Need Required parameters"
                }
            });
        }

        let doc = {
            active_user: req.body.active_user,
            is_active: true
        };

        if(req.body.active_user) {
            doc.is_active = true;
        } else {
            doc.is_active = false;
        }

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
