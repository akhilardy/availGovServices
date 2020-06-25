const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const config = require('./config')
const path = require('path');

//for cors request
const cors = require('cors');

const app = express();

async function connectToDatabase() {
    try {
        const connection = await mongoose.connect(config.mongodbURL, {
            useUnifiedTopology: true,
            useNewUrlParser: true,
            useFindAndModify: false
        });
        console.log(`connection established successfully`);
        return connection;
    } catch (err) {
        console.log(`connection was unsucessfull ${err}`);
    }
};

connectToDatabase().then(() => {
    //for cross origin resource sharing
    app.use(cors());

    //static
    app.use('/', express.static(path.join(__dirname, './')));

    //using body-parser
    app.use(bodyParser.json({
        limit: '10mb'
    }));
    app.use(bodyParser.urlencoded({
        extended: true,
        limit: '10mb',
        parameterLimit: 100000
    }));

    //routes
    //enter schemes available by hospital management
    const registerHospitalShemes = require('./routes/hospitalManagement');
    app.use('/api/hospitals', registerHospitalShemes);

    //nearby hospitals
    const hospitals = require('./routes/public');
    app.use('/api/public', hospitals);
});
app.listen(8080, () => {
    console.log('Listening on port 8080...');
});
module.exports = app;