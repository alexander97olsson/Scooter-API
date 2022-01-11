var express = require('express');
var router = express.Router();
const user = require("../src/user.js");
const auth = require("../src/auth.js");

//get all users
router.get('/',
    (req, res) => user.getAll(res)
);

//Get one user with id <id>
router.get('/:id',
    (req, res) => user.getOne(res, req)
);

//Create a user
router.post('/login',
    (req, res) => auth.login(res, req)
);

//Create a user
router.post('/register',
    (req, res) => auth.register(res, req)
);

//Update balance
router.put('/balance',
    (req, res, next) => auth.checkToken(req, res, next),
    (req, res) => user.updateBalance(res, req)
);

//Add one trip to user
router.put('/trip',
    (req, res, next) => auth.checkToken(req, res, next),
    (req, res) => user.insertTrip(res, req)
);

//Delete one user
router.delete('/',
    (req, res, next) => auth.checkToken(req, res, next),
    (req, res) => user.deleteUser(res, req)
);

module.exports = router;
