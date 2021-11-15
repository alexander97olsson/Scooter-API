var express = require('express');
var router = express.Router();
const scooter = require("../src/scooter.js");

//Get all scooters
router.get('/',
    (req, res) => scooter.getAll(res, req)
);

//Get one scooter with id <id>
router.get('/:id',
    (req, res) => scooter.getOne(res, req)
);

//Create a scooter
router.post('/',
    (req, res) => scooter.createScooter(res, req)
);

//Update a scooter, for example scooter battery
router.put('/',
    (req, res) => scooter.updateScooter(res, req)
);

//Start scooter (updateing start_time)
router.put('/start',
    (req, res) => scooter.startScooter(res, req)
);

//Add a log of data in the scooter
router.put('/insertLogg',
    (req, res) => scooter.insertLogg(res, req)
);

//Update which user are active on the scooter or if there is no active user
router.put('/setuser',
    (req, res) => scooter.updateUserInfo(res, req)
);

//Delete one scooter
router.delete('/',
    (req, res) => scooter.deleteScooter(res, req)
);

module.exports = router;
