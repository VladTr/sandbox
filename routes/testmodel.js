const express = require('express');
const router = express.Router();
//const Region = require('../models/region-new');
const Region = require('mongoose').model('Region');
const Area = require('../models/area-new');


router.get('/', function (req, res) {


    var reg = new Region({
        name:{
            last:{
                ua:'Вінницька',
                ru:'new rus name'
            },
            old:{
                ua:'old ua name'
            }
        }
    });

    reg.save(function (err) {
        if (err) {
            console.log(err);
        }
    });

    Region.findOne({'name.last.ua':'Вінницька'}, function (err, region) {
        if (err) {
            console.log(err)
        } else {
            console.dir(region.name.last.ua);
            console.dir(region._id);
            var ar = new Area({
               name:{
                   last:{
                       ua:'Барський'
                   }
               },
               region:region._id
            });
            ar.save(function (err) {
                if (err) {
                    console.log(err);
                }
            });
        }

    });

    res.send('test models');
});


router.get('/find', function (req, res) {
    // Area.findOne({test:'old'}, function (err, area) {
    //     console.log(area.region);
    // });
    Area.findOne({test:'old'}).populate('region').exec(function (err, region) {
       if (err) console.log(err);
       if (region) console.log(region.region.name.last.ua);
    });
    res.end();
});


module.exports = router;