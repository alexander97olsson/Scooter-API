
/* global describe it */

process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../index.js');

chai.should();

chai.use(chaiHttp);

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
