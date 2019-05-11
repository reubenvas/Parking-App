const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const favicon = require('express-favicon');
const path = require('path');

const { promisify } = require('util');
const { writeFile, readFile, readdir, unlink } = require('fs');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors());

// the __dirname is the current directory
// from where the script is running
app.use(favicon(path.join( __dirname, '/../client/build/favicon.ico')));
// app.use(express.static(__dirname));
// app.use(express.static(path.join(__dirname, '/../client')));
console.log(path.join(__dirname, '/../client', 'build'));
app.use(express.static(path.join(__dirname, '/../client', 'build')));

app.get('/', (req, res) => {
    res.sendFile(path.join( __dirname, '/../client', 'build', 'index.html'));
  });

app.post('/userdata', (req, res) => {
    const accessKey = storeUserdataToFile(req.body);
    res.status(202).send(accessKey);
})

function storeUserdataToFile(userdata) {
    const generateUuid = require('uuid/v1');
    const accessKey = generateUuid();
    const time = getTimeSeconds();
    const userInfo = {
        ...userdata,
        time_of_arrival: time,
        access_key: accessKey
    };

    writeUserdataFile(accessKey, userInfo);
    return accessKey;
}

function getTimeSeconds() {
    const millisec = Date.now();
    const seconds = millisec / 1e3;
    return Math.floor(seconds);
}

app.get('/userdata', async (req, res) => {
    if (!req.headers.authorization) {
        res.status(401).send('The access key did not match the');
        return;
    }
    const fileName = req.headers.authorization.split(' ')[1] + '.txt';
    const userdataFiles = await getUserdataFiles();
    if (!userdataFiles.includes(fileName)) {
        res.status(404).send('filename does not match with any in');
        return;
    }
    getUserdataInfo(fileName)
        .then(data => res.status(202).send(data))
        .catch(err => res.status(500).send('Found file with access key but could not read it:', err));
})

function writeUserdataFile(accessKey, userInfo) {
    writeFile(`./userdata/${accessKey}.txt`, JSON.stringify(userInfo), (err) => {
        if (err) throw err;
        console.log('The file has been saved!');
    })
}

function getUserdataFiles() {
    const readdirProm = promisify(readdir);
    return readdirProm('./userdata')
        .catch(err => console.error(err));
}

function getUserdataInfo(fileName) {
    const readfileProm = promisify(readFile);
    return readfileProm(`./userdata/${fileName}`, 'utf8')
        .then(userObj => addLengthOfVisit(userObj))
}

function deleteUserdataFile(fileName) {
    unlink(`./userdata/${fileName}`, err => {
        if (err) throw err;
        console.log(`./userdata/${fileName} was deleted`);
    });
}

function addLengthOfVisit(userInfoJSON) {
    const userInfoObj = JSON.parse(userInfoJSON);
    const time = getTimeSeconds();
    userInfoObj.length_of_visit = time;
    return JSON.stringify(userInfoObj);
}

app.delete('/userdata', async (req, res) => {
    const userdataFiles = await getUserdataFiles();
    const accessKey = req.headers.authorization;
    if (!accessKey) {
        res.status(400).send('Missing access key');
        return;
    }
    const fileName = accessKey.split(' ')[1] + '.txt';
    if (!userdataFiles.includes(fileName)) {
        res.status(401).send('Cannot find file on');
        return;
    }
    deleteUserdataFile(fileName);
    res.status(202).send('file deleted');
}) //delete file thats sent in body

module.exports.app = app;