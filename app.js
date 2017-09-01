const express = require('express');
const app = express();
const path = require('path');

const parse = require('./routes/parse');
const findCourt = require('./routes/findcourt');
const ukrParse = require('./routes/ukr-parse');
const openMap = require('./routes/openmap');
const testModel = require('./routes/testmodel');
const addRegions = require('./routes/add-regions');

app.set('views', path.join(__dirname, 'public'));
//app.set('view engine', 'jade');

app.use(express.static(__dirname + "/public"));

app.get('/', function (req, res) {
    res.send('index');
});

app.use('/parse', parse);
app.use('/findcourt', findCourt);
app.use('/ukr-parse', ukrParse);
app.use('/openmap', openMap);
app.use('/modeltest', testModel);
app.use('/add-regions', addRegions);

app.listen(8080, function () {
    console.log('Example app listening on port 8080!')
});

