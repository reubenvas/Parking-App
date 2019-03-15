const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors')


const { promisify } = require('util');

const fs = require('fs');

const app = express();

app.use(bodyParser.json()); //onödig??
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors());

app.get('/', (req, res) => {
    res.send('hola me llamo reuben');
})

app.post('/submit_userdata', (req, res) => {
    // should be sent in x-www-form-urlencoded
    // 'name=Reuben_Vas&car_number=ABC123&car_model=Volvo
    // try w/o underscores

    const accessKey = storeUserdataToFile(req.body);
    res.status(202).send(accessKey);
})

function storeUserdataToFile(userdata) {
    const generateUuid = require('uuid/v1');
    const accessKey = generateUuid();
    const time = getTimeMinutes();
    const userInfo = {
        ...userdata,
        time_of_arrival: time,
        access_key: accessKey
    };

    fs.writeFile(`./server/userdata/${accessKey}.txt`, JSON.stringify(userInfo), (err) => {
        if (err) throw err;
        console.log('The file has been saved!');
    })
    return accessKey;
}

function getTimeMinutes() {
    const millisec = Date.now();
    const minutes = millisec / 6e4;
    return Math.floor(minutes);
}

app.get('/get_userdata', async (req, res) => {
    // use authorization
    let userAccessKey;
    if (!req.headers.authorization) {
        res.status(401).send('The access key did not match the server')
    }
    userAccessKey = req.headers.authorization.split(' ')[1];
    const userdataFiles = await getUserdataFiles();
    const fileName = userdataFiles
        .map(fileName => fileName.split('.')[0])
        .find(accessKey => accessKey === userAccessKey);
    const readfileProm = promisify(fs.readFile);
    readfileProm(`./server/userdata/${fileName}.txt`, 'utf8')
        .then(userObj => addLengthOfVisit(userObj))
        .then(data => res.status(202).send(data))
        .catch(err => res.status(500).send('Found file with access key but could not read it:', err));
})

function getUserdataFiles() {
    const readdirProm = promisify(fs.readdir);
    return readdirProm('./server/userdata')
        .catch(err => console.error(err));
}

function addLengthOfVisit(userInfoJSON) {
    const userInfoObj = JSON.parse(userInfoJSON);
    const time = getTimeMinutes();
    userInfoObj.length_of_visit = time;
    return JSON.stringify(userInfoObj);
}

module.exports.app = app;