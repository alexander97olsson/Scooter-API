
/* global describe it */
process.env.NODE_ENV = 'test';

const { assert } = require('chai');
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../index.js');

let config;

try {
    config = require("../config.json");
} catch (error) {
    console.error(error);
}

const token = process.env.JWT_TOKEN || config.token;

//const database = require("../db/database.js");
//const collectionName = "city";

chai.should();

chai.use(chaiHttp);

describe('Testing routes for cities', () => {
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
        //first create a city to work with
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
                .set({"x-access-token": token})
                .send(doc)
                .end((err, res) => {
                    res.should.have.status(201);
                    done();
                });
        });

        it('should try to create a city with wrong parameters', (done) => {
            let doc = {
                city: "Stockholm",
                part1_lat: 59.3831,
                part1_lng: 17.9370,
                part2_lat: 59.3727,
                part2_lng: 18.1446
            };

            chai.request(server)
                .post("/api/cities")
                .set({"x-access-token": token})
                .send(doc)
                .end((err, res) => {
                    res.should.have.status(400);
                    assert.equal(res.body.errors.message, "Need Required parameters");
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

    describe('Try insert and update posts and zones', () => {
        it('Try to add a zone to Stockholm with wrong parameters', (done) => {
            let doc = {
                city: "Stockholm",
                amount_of_bikes: 10,
                color: "red"
            };

            chai.request(server)
                .put("/api/cities/zones")
                .send(doc)
                .end((err, res) => {
                    res.should.have.status(400);
                    done();
                });
        });
        it('Add a zone to Stockholm', (done) => {
            let doc = {
                city: "Stockholm",
                amount_of_bikes: 10,
                color: "red",
                part1_lat: 12.12,
                part1_lng: 12.12,
                part2_lat: 12.12,
                part2_lng: 12.12,
                part3_lat: 12.12,
                part3_lng: 12.12,
                part4_lat: 12.12,
                part4_lng: 12.12
            };

            chai.request(server)
                .put("/api/cities/zones")
                .send(doc)
                .end((err, res) => {
                    res.should.have.status(200);
                    done();
                });
        });
        it('Add a post to Stockholm', (done) => {
            let doc = {
                city: "Stockholm",
                amount_of_bikes: 5,
                color: "blue",
                part1_lat: 13.12,
                part1_lng: 13.12,
                part2_lat: 13.12,
                part2_lng: 13.12,
                part3_lat: 13.12,
                part3_lng: 13.12,
                part4_lat: 13.12,
                part4_lng: 13.12
            };

            chai.request(server)
                .put("/api/cities/posts")
                .send(doc)
                .end((err, res) => {
                    res.should.have.status(200);
                    done();
                });
        });

        it('Update a post to Stockholm with color blue', (done) => {
            let doc = {
                city: "Stockholm",
                amount_of_bikes: 7,
                color: "blue"
            };

            chai.request(server)
                .put("/api/cities/posts/update")
                .send(doc)
                .end((err, res) => {
                    res.should.have.status(200);
                    done();
                });
        });

        it('Update a zone to Stockholm with color red', (done) => {
            let doc = {
                city: "Stockholm",
                amount_of_bikes: 89,
                color: "red"
            };

            chai.request(server)
                .put("/api/cities/zones/update")
                .send(doc)
                .end((err, res) => {
                    res.should.have.status(200);
                    done();
                });
        });

        it('Test new values for Stockholm', (done) => {
            chai.request(server)
                .get("/api/cities/Stockholm")
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.an("object");
                    res.body.data.should.be.an("array");
                    res.body.data.length.should.be.above(0);
                    assert.equal(res.body.data[0].city, "Stockholm");
                    assert.equal(res.body.data[0].parking_zones[0].color, "red");
                    assert.equal(res.body.data[0].parking_zones[0].amount_of_bikes_zone, 89);
                    assert.equal(res.body.data[0].parking_zones[0]
                        .position.polygonePart1.lat, 12.12);
                    assert.equal(res.body.data[0].charging_posts[0].color, "blue");
                    assert.equal(res.body.data[0].charging_posts[0].amount_of_bikes_post, 7);
                    assert.equal(res.body.data[0].charging_posts[0]
                        .position.polygonePart1.lat, 13.12);
                    done();
                });
        });

        it('Get all zones in specific city', (done) => {
            chai.request(server)
                .get("/api/cities/zones/Stockholm")
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.an("object");
                    res.body.data.should.be.an("array");
                    res.body.data.length.should.be.above(0);
                    assert.equal(res.body.data[0].amount_of_bikes_zone, 89);
                    done();
                });
        });

        it('Get all posts in specific city', (done) => {
            chai.request(server)
                .get("/api/cities/posts/Stockholm")
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.an("object");
                    res.body.data.should.be.an("array");
                    res.body.data.length.should.be.above(0);
                    assert.equal(res.body.data[0].amount_of_bikes_post, 7);
                    done();
                });
        });
    });

    describe('Update and delete in city', () => {
        it('Should update Stockholm', (done) => {
            let doc = {
                city: "Stockholm",
                amount_of_bikes: 1337
            };

            chai.request(server)
                .put("/api/cities")
                .send(doc)
                .end((err, res) => {
                    res.should.have.status(200);
                    done();
                });
        });

        it('Should delete Stockholm', (done) => {
            let doc = {
                city: "Stockholm",
            };

            chai.request(server)
                .delete("/api/cities")
                .set({"x-access-token": token})
                .send(doc)
                .end((err, res) => {
                    res.should.have.status(200);
                    done();
                });
        });
    });
});
