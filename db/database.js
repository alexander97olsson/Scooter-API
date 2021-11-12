/**
 * Connect to the database and search using a criteria.
 */
"use strict";
//const config = require("../config.json");
const mongo = require("mongodb").MongoClient;
const collectionScooter = "scooter";
const collectionUser = "user";
const collectionCity = "city";

let config;

try {
    config = require("../config.json");
} catch (error) {
    console.error(error);
}

const database = {
    getDb: async function getDb() {
        let dsn = "mongodb://localhost:27017/test";

        if (process.env.NODE_ENV !== 'test') {
            dsn = `mongodb+srv://${config.username}:${config.password}` +
            `@cluster0.maafq.mongodb.net/scootersDatabase?retryWrites=true&w=majority`;
        }

        const client  = await mongo.connect(dsn, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        const db = await client.db();
        const collection = await db.collection(collectionScooter);
        const userCollection = await db.collection(collectionUser);
        const cityCollection = await db.collection(collectionCity);

        return {
            db: db,
            collection: collection,
            userCollection: userCollection,
            cityCollection: cityCollection,
            client: client,
        };
    }
};

module.exports = database;
