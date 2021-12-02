
/* global describe it */

process.env.NODE_ENV = 'test';

const { assert } = require('chai');
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../index.js');

const database = require("../db/database.js");
const collectionName = "scooter";

chai.should();

chai.use(chaiHttp);

describe('scooter_data', () => {
    before(() => {
        return new Promise(async (resolve) => {
            const db = await database.getDb();

            db.db.listCollections(
                { name: collectionName }
            )
                .next()
                .then(async function(info) {
                    if (info) {
                        await db.collection.drop();
                    }
                })
                .catch(function(err) {
                    console.error(err);
                })
                .finally(async function() {
                    await db.client.close();
                    resolve();
                });
        });
    });

    describe('GET /cities', () => {
        it('should create a scooter', (done) => {
            const doc = {
                active_user: "alex",
                city_location: "Stockholm",
                lat: 59.5237,
                lng: 18.2323,
                battery: 100,
                is_active: false,
                speed: 0,
                start_time: "16.30",
                logg: []
            };

            chai.request(server)
                .post("/api/scooter")
                .send(doc)
                .end((err, res) => {
                    res.should.have.status(201);
                    done();
                });
        });

        it('Should give me all scooters', (done) => {
            chai.request(server)
                .get("/api/scooter")
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.an("object");
                    res.body.data.should.be.an("array");
                    res.body.data.length.should.be.above(0);
                    done();
                });
            });
        });
    });