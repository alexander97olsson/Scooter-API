const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const bodyParser = require("body-parser");
const scooter = require('./routes/scooter.js');
const city = require('./routes/city.js');
const user = require('./routes/user.js');

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
app.use('/api/scooter', scooter);
app.use('/api/cities', city);
app.use('/api/user', user);

// Start up server
app.listen(port, () => console.log(`Example API listening on port ${port}!`));
