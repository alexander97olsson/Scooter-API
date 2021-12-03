
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

    describe('GET /customers', () => {
        //first create a user to work with
        it('should try to login but create user', (done) => {
            const doc = {
                username: "alexander"
            };

            chai.request(server)
                .post("/api/customers/login")
                .send(doc)
                .end((err, res) => {
                    res.should.have.status(200);
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
                        .send(doc)
                        .end((err, res) => {
                            res.should.have.status(200);
                            done();
                        });
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
                    assert.equal(res.body.data[0].balance, 1337);
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
                        .send(doc)
                        .end((err, res) => {
                            res.should.have.status(200);
                            done();
                        });
                });
        });
    });
});
