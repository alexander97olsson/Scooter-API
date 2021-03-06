const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const bodyParser = require("body-parser");
const scooter = require('./routes/scooter.js');
const city = require('./routes/city.js');
const user = require('./routes/user.js');
const oauth = require('./routes/oAuth.js');

const app = express();
const port = 1337;

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(cors());

app.use((req, res, next) => {
    console.log(req.method);
    console.log(req.path);
    next();
});

if (process.env.NODE_ENV !== 'test') {
    app.use(morgan('combined'));
}

//Routes
app.get('/', function(req, res) {
    const data = {
        data: {
            msg: "Hello world, version 2.1"
        }
    };

    res.status(201).json(data);
});

app.use('/api/oauth', oauth);
app.use('/api/scooter', scooter);
app.use('/api/cities', city);
app.use('/api/customers', user);

// Start up server
const server = app.listen(port, () => console.log(`API listening on port ${port}!`));

// Export server
module.exports = server;
