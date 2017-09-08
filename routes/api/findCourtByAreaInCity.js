const express = require('express');
const router = express.Router();
const Area = require('../../models/area-new');
const Region = require('../../models/region-new');
const Court = require('../../models/court-new');
const path = require('path');
const url = require('url');
var async = require('asyncawait/async');
var await = require('asyncawait/await');

router.get('/subarea', function (req, res) {
    var region = (url.parse(req.url, true).query['region']);
    var city = (url.parse(req.url, true).query['city']);

    if (region && city) {
        //console.log(region+' : '+city);
        Region.findOne({'name.last.ua': region}, function (err, reg) {
            if (err) console.log(err);
            if (reg) {
                Area.find({'name.last.ua': city}).exec(function (err, ar) {
                    if (err) console.log(err);
                    if (ar.length != 0) { //большой или маленький город
                        console.log('большой или маленький город');
                    } else {
                        Area.find({'cities.name.last.ua': city}, function (err, ar) {
                            if (err) console.log(err);
                            if (ar.length != 0) { //большой или маленький город
                                console.log(ar[0].name.last.ua);
                                console.log(ar[0]._id);
                                findCourtById(ar[0]._id);
                            }
                        });
                    }
                });

            }
        });


    } else {
        res.sendFile(path.join(__dirname, '../../public', 'find-court.html'));
    }
});

var findCourtById = function (id) {
    var result= Court.findOne({'area':id}, function (err, court) {

        if (err) console.log(err);
        if (court) {
            console.log(court.name.last.ua);
            result = court.name.last.ua;
            console.log('--',result);
        }
    });
    return result;
};


function callback(err, court) {
    if (err) console.log(err);
    if (court) {
        court.forEach(function (item) {
           if (item.name.last){
               console.log(item.name.last.ua);
           }else {
               console.log(item);
           }
        });
    }
}

function callback2(err, area) {
    if (area){
        console.log(area);
    }
}

module.exports = router;