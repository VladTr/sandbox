const express = require('express');
const router = express.Router();
var cities = require('../data/7');
var func = require('../functions');

router.get('/', function (req, res) {
    res.send('parse cities')
    for (key in cities){
        console.log(cities[key]);
        var region = cities[key].split('/')[1];
        var city = cities[key].split('/')[0];
        func.findRegionAndAddCity(region, city);
    }
});


module.exports = router;