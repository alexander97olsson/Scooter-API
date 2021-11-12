var express = require('express');
var router = express.Router();
const user = require("../src/user.js");

router.get('/',
    (req, res) => user.getAll(res, req)
);

router.post('/',
    (req, res) => user.createUser(res, req)
);


module.exports = router;
