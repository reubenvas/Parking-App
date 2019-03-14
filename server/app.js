const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const {promisify} = require('util');

const fs = require('fs');

const app = express();

app.use(bodyParser.json()); //onödig??
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.get('/', (req, res) => {
    res.send('hola me llamo reuben');
})

app.post('/submit_userdata', (req, res) => {
    // should be sent in x-www-form-urlencoded
    // 'name=Reuben_Vas&car_number=ABC123&car_model=Volvo
    // try w/o underscores

    const accessKey = storeUserdataToFile(req.body);
    // add som more status codes if something goes wrong
    res.status(202).send(accessKey);
})

function storeUserdataToFile(userdata) {
    const generateUuid = require('uuid/v1');
    const accessKey = generateUuid();
    const time = getTimeHours();
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

function getTimeHours() {
    const millisec = Date.now();
    const hour = millisec / 3.6e6;
    return Math.floor(hour);
}

app.get('/get_userdata', async (req, res) => {
    // use authorization
    const userAccessKey = req.headers.authorization.split(' ')[1];
    const userdataFiles = await getUserdataFiles();
    const fileName = userdataFiles
                        .map(fileName => fileName.split('.')[0])
                        .find(accessKey => accessKey === userAccessKey);
    if (fileName) {
        const readfileProm = promisify(fs.readFile);
        readfileProm(`./server/userdata/${fileName}.txt`, 'utf8')
        .then(data => res.status(202).send(data))
        .catch(err => console.error(err))
    } else {
        res.send(401)
    }
})

function getUserdataFiles() {
    const readdirProm = promisify(fs.readdir);
    return readdirProm('./server/userdata')
            .catch(err => console.error(err));
}

module.exports.app = app;