
/* global describe it */

process.env.NODE_ENV = 'test';

const { assert } = require('chai');
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../index.js');
const ObjectId = require('mongodb').ObjectId;

//const database = require("../db/database.js");
//const collectionName = "scooter";

let config;

try {
    config = require("../config.json");
} catch (error) {
    console.error(error);
}

const token = process.env.JWT_TOKEN || config.token;

chai.should();

chai.use(chaiHttp);

describe('Testing routes for customers', () => {
    /*before(() => {
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
    });*/

    describe('create and get customers', () => {
        //first create a user to work with
        it('should try to and create a user with wrong parameters', (done) => {
            const doc = {
            };

            chai.request(server)
                .post("/api/customers/login")
                .send(doc)
                .end((err, res) => {
                    res.should.have.status(400);
                    done();
                });
        });
        it('should try to login but create user', (done) => {
            const doc = {
                username: "patrik"
            };

            chai.request(server)
                .post("/api/customers/login")
                .send(doc)
                .end((err, res) => {
                    res.should.have.status(200);
                    done();
                });
        });

        it('Should delete user patrik', (done) => {
            chai.request(server)
                .get("/api/customers")
                .end((err, res) => {
                    console.log(res.body.data[0]._id);
                    let doc = {
                        _id: res.body.data[0]._id,
                    };

                    chai.request(server)
                        .delete("/api/customers")
                        .set({"x-access-token": token})
                        .send(doc)
                        .end((err, res) => {
                            res.should.have.status(200);
                            done();
                        });
                });
        });

        it('should register an user this time', (done) => {
            const doc = {
                username: "alexander"
            };

            chai.request(server)
                .post("/api/customers/register")
                .send(doc)
                .end((err, res) => {
                    res.should.have.status(202);
                    done();
                });
        });

        it('Should give me all users', (done) => {
            chai.request(server)
                .get("/api/customers")
                .end((err, res) => {
                    res.should.have.status(201);
                    res.body.should.be.an("object");
                    res.body.data.should.be.an("array");
                    res.body.data.length.should.be.above(0);
                    done();
                });
        });

        it('Should give me user alexander', (done) => {
            chai.request(server)
                .get("/api/customers")
                .end((err, res) => {
                    res.should.have.status(201);
                    res.body.should.be.an("object");
                    res.body.data.should.be.an("array");
                    res.body.data.length.should.be.above(0);
                    assert.equal(res.body.data[0].username, "alexander");
                    assert.equal(res.body.data[0].tag, "customer");
                    assert.equal(res.body.data[0].balance, 10000);
                    done();
                });
        });

        it('Should give me user alexander by params', (done) => {
            chai.request(server)
                .get("/api/customers")
                .end((err, res) => {
                    console.log(res.body.data[0]._id);
                    let doc = {
                        _id: res.body.data[0]._id,
                    };

                    chai.request(server)
                        .get(`/api/customers/${doc._id}`)
                        .end((err, res) => {
                            res.should.have.status(201);
                            res.body.should.be.an("object");
                            assert.equal(res.body.data.username, "alexander");
                            assert.equal(res.body.data.tag, "customer");
                            assert.equal(res.body.data.balance, 10000);
                            done();
                        });
                });
        });
    });

    describe('Insert a trip in user alexander', () => {
        it('Should update alexander balance', (done) => {
            chai.request(server)
                .get("/api/customers")
                .end((err, res) => {
                    console.log(res.body.data[0]._id);
                    let doc = {
                        _id: res.body.data[0]._id,
                        trip_id: ObjectId(),
                        date: "2021-11-08",
                        price: 25,
                        start_lat: 59.3153,
                        start_lng: 18.0344,
                        start_time: 12.06,
                        stop_lat: 59.3153,
                        stop_lng: 18.0344,
                        stop_time: 12.06
                    };

                    chai.request(server)
                        .put("/api/customers/trip")
                        .set({"x-access-token": token})
                        .send(doc)
                        .end((err, res) => {
                            res.should.have.status(200);
                            assert.equal(res.body.data.result, `Object: ${doc._id} updated`);
                            done();
                        });
                });
        });
    });

    describe('Update and delete in customers', () => {
        it('Should update alexander balance', (done) => {
            chai.request(server)
                .get("/api/customers")
                .end((err, res) => {
                    console.log(res.body.data[0]._id);
                    let doc = {
                        _id: res.body.data[0]._id,
                        balance: 1337
                    };

                    chai.request(server)
                        .put("/api/customers/balance")
                        .set({"x-access-token": token})
                        .send(doc)
                        .end((err, res) => {
                            res.should.have.status(200);
                            done();
                        });
                });
        });

        it('Should give me user update alexander and with 1 trip inserted', (done) => {
            chai.request(server)
                .get("/api/customers")
                .end((err, res) => {
                    res.should.have.status(201);
                    res.body.should.be.an("object");
                    res.body.data.should.be.an("array");
                    res.body.data.length.should.be.above(0);
                    assert.equal(res.body.data[0].username, "alexander");
                    assert.equal(res.body.data[0].tag, "customer");
                    assert.equal(res.body.data[0].balance, 1337);
                    //check for the inserted trip
                    assert.equal(res.body.data[0].trips[0].price, 25);
                    assert.equal(res.body.data[0].trips[0].date, "2021-11-08");
                    assert.equal(res.body.data[0].trips[0].start.time, 12.06);
                    done();
                });
        });

        it('Should delete user alexander', (done) => {
            chai.request(server)
                .get("/api/customers")
                .end((err, res) => {
                    console.log(res.body.data[0]._id);
                    let doc = {
                        _id: res.body.data[0]._id,
                    };

                    chai.request(server)
                        .delete("/api/customers")
                        .set({"x-access-token": token})
                        .send(doc)
                        .end((err, res) => {
                            res.should.have.status(200);
                            done();
                        });
                });
        });
    });
});
