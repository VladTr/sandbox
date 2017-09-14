const express = require('express');
const app = express();
const path = require('path');

const parse = require('./routes/parse');
const findCourt = require('./routes/findcourt');
const ukrParse = require('./routes/ukr-parse');
//const openMap = require('./routes/openmap');
const openMap = require('./routes/api/open_map');
const testModel = require('./routes/testmodel');
const addRegions = require('./routes/add-regions');
const parseCities = require('./routes/parse-cities');
const parseStreets = require('./routes/parse-streets');

const findSubarea = require('./routes/api/findSubarea');
const findCourtBy = require('./routes/api/findCourtByAreaInCity');
const findAreaBy = require('./routes/api/findAreaByCiteAndRegion');
const createCourt = require('./routes/api/createCourt');

const companyParser = require('./routes/company-parse');

/*
*
* start testing block
*
*/
const crud = require('./routes/api/crud-test');
app.route('/get-region').get(crud.getRegion);
app.route('/count-regions').get(crud.regionsCount);
app.route('/get-area').get(crud.getArea);
app.route('/count-areas').get(crud.areasCount);
app.route('/get-court').get(crud.getCourt);
app.route('/count-courts').get(crud.courtsCount);
app.route('/court-find').get(crud.courtFind);
app.route('/count-streets').get(crud.countStreets);
/*
* end testing block
 */
app.set('views', path.join(__dirname, 'public'));


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
app.use('/parse-cities', parseCities);
app.use('/parse-streets', parseStreets);

app.use('/api/find-subarea', findSubarea);
app.use('/api/find-court-by/', findCourtBy);
app.use('/api/area', findAreaBy);
app.use('/api/create-court', createCourt);

app.use('/company-parse', companyParser);

app.listen(8080, function () {
    console.log('Example app listening on port 8080!')
});

module.exports = app;// for testing
