const express = require('express');
const router = express.Router();
var regions = require('../data/regions-all');
var Region = require('../models/region-new');


router.get('/', function (req, res) {
    res.send('add regions');
    regions.forEach(function (region) {
        addRegions(region.name);
    });
});


function addRegions(name) {
    Region.findOne({'name.last.ua':name}, function (err, reg) {
        if (err) console.log(err);
        if (!reg) {
            var newReg = new Region({
                name:{
                    last:{
                        ua:name
                    }
                }
            });
            newReg.save(function (err) {
                if (err) console.log(err);
            });
        } else {
            console.log('область уже есть: '+name);
        }
    });
}

module.exports = router;