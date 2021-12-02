
/* global describe it */
process.env.NODE_ENV = 'test';

const { assert } = require('chai');
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../index.js');

//const database = require("../db/database.js");
//const collectionName = "city";

chai.should();

chai.use(chaiHttp);

describe('user_data', () => {
    /*before(() => {
        return new Promise(async (resolve) => {
            const db = await database.getDb();

            db.db.listCollections(
                { name: collectionName }
            )
                .next()
                .then(async function(info) {
                    if (info) {
                        await db.cityCollection.drop();
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
    });*/

    describe('GET /cities', () => {
        it('should create a city', (done) => {
            let doc = {
                city: "Stockholm",
                part1_lat: 59.3831,
                part1_lng: 17.9370,
                part2_lat: 59.3727,
                part2_lng: 18.1446,
                part3_lat: 59.2933,
                part3_lng: 17.9927,
                part4_lat: 59.3020,
                part4_lng: 18.1479
            };

            chai.request(server)
                .post("/api/cities")
                .send(doc)
                .end((err, res) => {
                    res.should.have.status(201);
                    done();
                });
        });

        it('Should give me all cities', (done) => {
            chai.request(server)
                .get("/api/cities")
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.an("object");
                    res.body.data.should.be.an("array");
                    res.body.data.length.should.be.above(0);
                    done();
                });
        });

        it('Should give me Stockholm', (done) => {
            chai.request(server)
                .get("/api/cities/Stockholm")
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.an("object");
                    res.body.data.should.be.an("array");
                    res.body.data.length.should.be.above(0);
                    assert.equal(res.body.data[0].city, "Stockholm");
                    done();
                });
        });
    });

    describe('Other things about cities', () => {
        it('Should delete Stockholm', (done) => {
            let doc = {
                city: "Stockholm",
            };

            chai.request(server)
                .delete("/api/cities")
                .send(doc)
                .end((err, res) => {
                    res.should.have.status(200);
                    done();
                });
        });
    });

    describe('GET /index', () => {
        it('testing index', (done) => {
            chai.request(server)
                .get("/")
                .end((err, res) => {
                    res.should.have.status(201);
                    console.log(res.body.data.msg);
                    done();
                });
        });
    });
});
