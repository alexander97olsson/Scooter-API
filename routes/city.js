var express = require('express');
var router = express.Router();
const city = require("../src/city.js");

//Get all cities
router.get('/',
    (req, res) => city.getAll(res)
);

//Get one city with name of <city>
router.get('/:city',
    (req, res) => city.getOne(res, req)
);

//Create one city
router.post('/',
    (req, res) => city.createCity(res, req)
);

//Update city
router.put('/',
    (req, res) => city.updateCity(res, req)
);

//Add one zone to specific city
router.put('/zones',
    (req, res) => city.insertZones(res, req)
);

//update amount of bikes in city
router.put('/zones/update',
    (req, res) => city.updateZones(res, req)
);

//get one zone to specific city
router.get('/zones/:city',
    (req, res) => city.getZonesInCity(res, req)
);

//Add one posts to specific city
router.put('/posts',
    (req, res) => city.insertPosts(res, req)
);

//update amount of bikes in city
router.put('/posts/update',
    (req, res) => city.updatePosts(res, req)
);

//get one zone to specific city
router.get('/posts/:city',
    (req, res) => city.getPostsInCity(res, req)
);

//Delete one city
router.delete('/',
    (req, res) => city.deleteCity(res, req)
);

module.exports = router;
