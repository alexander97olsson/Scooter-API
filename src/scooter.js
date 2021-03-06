"use strict";
const database = require("../db/database.js");
const ObjectId = require('mongodb').ObjectId;

const data = {
    getAll: async function all(res) {
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
            const result = await db.collection.find({_id: ObjectId(req.params.id)}).toArray();

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
        if (!req.body.city_location || !req.body.lat || !req.body.lng) {
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
            active_user: req.body.active_user,
            city_location: req.body.city_location,
            position: {
                lat: parseFloat(req.body.lat),
                lng: parseFloat(req.body.lng)
            },
            battery: 100,
            is_active: false,
            speed: 0,
            start_time: req.body.start_time,
            logg: []
        };

        if (req.body.active_user) {
            doc.is_active = true;
        }
        let db;

        try {
            db = await database.getDb();
            const result = await db.collection.insertOne(doc);

            if (result) {
                if (req.body.active_user) {
                    const filter = { _id: ObjectId(result.insertedId) };
                    let updateDoc = {
                        $push: {
                            logg: {
                                user: req.body.active_user,
                                event: req.body.event,
                                start: {
                                    position: {
                                        lat: parseFloat(req.body.start_lat),
                                        lng: parseFloat(req.body.start_lng)
                                    },
                                    time: req.body.start_time
                                },
                                end: {
                                    position: {
                                        lat: parseFloat(req.body.end_lat),
                                        lng: parseFloat(req.body.end_lng)
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
    updateScooter: async function updateData(res, req) {
        const filter = { _id: ObjectId(req.body._id) };

        if (!req.body._id ||
            !req.body.battery ||
            !req.body.speed ||
            !req.body.lat ||
            !req.body.lng) {
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
            position: {
                lat: parseFloat(req.body.lat),
                lng: parseFloat(req.body.lng)
            }
        };
        let db;

        try {
            db = await database.getDb();
            await db.collection.updateOne(filter, {$set: doc});

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
    insertLogg: async function log(res, req) {
        const filter = { _id: ObjectId(req.body._id) };

        if (!req.body._id ||
            !req.body.event ||
            !req.body.active_user ||
            !req.body.start_lat ||
            !req.body.start_lng ||
            !req.body.start_time ||
            !req.body.end_lat ||
            !req.body.end_lng ||
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
                    event: req.body.event,
                    start: {
                        position: {
                            lat: parseFloat(req.body.start_lat),
                            lng: parseFloat(req.body.start_lng)
                        },
                        time: req.body.start_time
                    },
                    end: {
                        position: {
                            lat: parseFloat(req.body.end_lat),
                            lng: parseFloat(req.body.end_lng)
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

        if (req.body.active_user) {
            doc.is_active = true;
        } else {
            doc.is_active = false;
        }

        let db;

        try {
            db = await database.getDb();
            await db.collection.updateOne(filter, {$set: doc});

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
    }
};

module.exports = data;
