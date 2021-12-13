
/* global describe it */

process.env.NODE_ENV = 'test';

const { assert } = require('chai');
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../index.js');

//const database = require("../db/database.js");
//const collectionName = "scooter";

chai.should();

chai.use(chaiHttp);

describe('scooter_data', () => {
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

    describe('create and get scooters', () => {
        it('should try to create a scooter with wrong parameters', (done) => {
            const doc = {
                active_user: "alex",
                city_location: "Stockholm"
            };

            chai.request(server)
                .post("/api/scooter")
                .send(doc)
                .end((err, res) => {
                    res.should.have.status(400);
                    done();
                });
        });
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

        it('Should give me one scooter', (done) => {
            chai.request(server)
                .get("/api/scooter")
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.an("object");
                    res.body.data.should.be.an("array");
                    res.body.data.length.should.be.above(0);
                    assert.equal(res.body.data[0].active_user, "alex");
                    done();
                });
        });

        it('Should give me scooter by id in params', (done) => {
            chai.request(server)
                .get("/api/scooter")
                .end((err, res) => {
                    console.log(res.body.data[0]._id);
                    let doc = {
                        _id: res.body.data[0]._id,
                    };

                    chai.request(server)
                        .get(`/api/scooter/${doc._id}`)
                        .end((err, res) => {
                            res.should.have.status(201);
                            res.body.should.be.an("object");
                            assert.equal(res.body.data[0].active_user, "alex");
                            done();
                        });
                });
        });
    });
    describe('Update a scooter', () => {
        it('Should start a scooter', (done) => {
            chai.request(server)
                .get("/api/scooter")
                .end((err, res) => {
                    console.log(res.body.data[0]._id);
                    let doc = {
                        _id: res.body.data[0]._id,
                        start_time: 16.30
                    };

                    chai.request(server)
                        .put("/api/scooter/start")
                        .send(doc)
                        .end((err, res) => {
                            res.should.have.status(200);
                            done();
                        });
                });
        });

        it('Should update a scooter', (done) => {
            chai.request(server)
                .get("/api/scooter")
                .end((err, res) => {
                    console.log(res.body.data[0]._id);
                    let doc = {
                        _id: res.body.data[0]._id,
                        speed: 60,
                        battery: 55,
                        lat: 59.400,
                        lng: 18.400
                    };

                    chai.request(server)
                        .put("/api/scooter")
                        .send(doc)
                        .end((err, res) => {
                            res.should.have.status(200);
                            done();
                        });
                });
        });

        it('Should update user for scooter', (done) => {
            chai.request(server)
                .get("/api/scooter")
                .end((err, res) => {
                    console.log(res.body.data[0]._id);
                    let doc = {
                        _id: res.body.data[0]._id,
                        active_user: "patrik"
                    };

                    chai.request(server)
                        .put("/api/scooter/setuser")
                        .send(doc)
                        .end((err, res) => {
                            res.should.have.status(200);
                            done();
                        });
                });
        });

        it('Check updated scooter for right updated values', (done) => {
            chai.request(server)
                .get("/api/scooter")
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.an("object");
                    res.body.data.should.be.an("array");
                    res.body.data.length.should.be.above(0);
                    assert.equal(res.body.data[0].active_user, "patrik");
                    assert.equal(res.body.data[0].speed, 60);
                    assert.equal(res.body.data[0].battery, 55);
                    assert.equal(res.body.data[0].position.lat, 59.400);
                    assert.equal(res.body.data[0].position.lng, 18.400);
                    done();
                });
        });
    });
    describe('Insert a log to scooter', () => {
        it('Should add a log to a specific scooter', (done) => {
            chai.request(server)
                .get("/api/scooter")
                .end((err, res) => {
                    console.log(res.body.data[0]._id);
                    let doc = {
                        _id: res.body.data[0]._id,
                        active_user: "patrik",
                        event: "First test log, very cool",
                        start_time: 16.30,
                        start_lat: 59.400,
                        start_lng: 18.400,
                        end_time: 17.30,
                        end_lat: 59.500,
                        end_lng: 18.500,
                    };

                    chai.request(server)
                        .put("/api/scooter/insertLogg")
                        .send(doc)
                        .end((err, res) => {
                            res.should.have.status(200);
                            done();
                        });
                });
        });

        it('Check updated scooter for inserted log', (done) => {
            chai.request(server)
                .get("/api/scooter")
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.an("object");
                    res.body.data.should.be.an("array");
                    res.body.data.length.should.be.above(0);
                    //alla skapas med ett event så event [1] är den nya
                    assert.equal(res.body.data[0].logg[1].event, "First test log, very cool");
                    assert.equal(res.body.data[0].logg[1].user, "patrik");
                    done();
                });
        });
    });

    describe('Delete scooter', () => {
        it('Should delete a scooter', (done) => {
            chai.request(server)
                .get("/api/scooter")
                .end((err, res) => {
                    console.log(res.body.data[0]._id);
                    let doc = {
                        _id: res.body.data[0]._id,
                    };

                    chai.request(server)
                        .delete("/api/scooter")
                        .send(doc)
                        .end((err, res) => {
                            res.should.have.status(200);
                            done();
                        });
                });
        });
    });
});
