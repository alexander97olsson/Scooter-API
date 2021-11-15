var express = require('express');
var router = express.Router();
const user = require("../src/user.js");

//get all users
router.get('/',
    (req, res) => user.getAll(res, req)
);

//Get one user with id <id>
router.get('/:id',
    (req, res) => scooter.getOne(res, req)
);

//Get one user with name <name>
router.get('/:name',
    (req, res) => scooter.getOne(res, req)
);

//Create a user
router.post('/',
    (req, res) => user.createUser(res, req)
);

//Update a user
router.put('/',
    (req, res) => user.createUser(res, req)
);

//Update balance
router.put('/balance',
    (req, res) => user.createUser(res, req)
);

module.exports = router;
