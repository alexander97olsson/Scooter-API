const express = require("express");
var router = express.Router();
const oauth = require("../src/oAuth.js");

router.post('/authenticate',
    (req, res) => {
        oauth.returnGithubResponse(res, req);
    }
);

module.exports = router;
