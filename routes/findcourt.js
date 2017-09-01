const express = require('express');
const router = express.Router();
var url = require('url');
var Court = require('../models/court');

router.get('/', function (req, res) {

    var region = (url.parse(req.url, true).query['region']);
    var area = (url.parse(req.url, true).query['area']);
    console.log('region:  '+region);
    console.log('area:  '+area);
    Court.find({
        $and:[
            {region:region},
            {"area.newName": area}
        ]
    }, function (err, court) {
        if (err) {
            console.log(err);
        }
        //console.log(court[0].area.newName);
        if (court[0] !== undefined) {
            res.send(court[0].name.newName+'  '+court[0].address+'  '+court[0].phone+'   '+court[0].email);
        } else {
            res.send('Получить суд не удалось');
        }
    });

});

module.exports = router;