const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

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
    res.send(200, accessKey);
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

    fs.writeFile(`./server/userdata/${accessKey}.json`, JSON.stringify(userInfo), (err) => {
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

app.get('/get_userdata', (req, res) => {
    // use authorization
    const accessKey = req.headers.authorization;
    console.log(accessKey);
    res.send('some data');
})


module.exports.app = app;