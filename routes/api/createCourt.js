var express = require('express');
var router = express.Router();
var Court = require('../../models/court-new');
var Region = require('../../models/region-new');
var mongoose = require('mongoose');

router.get('/', function (req, res) {
    res.send('create court');
    Region.findOne({'name.last.ua':'Київська'}, function (err, region) {
        if (err) console.log(err);
        if (region){
            var court = new Court({
                name:{
                    last:{
                        ua:'Поліський районний суд Київської області (скасований)'
                    }
                },
                area:mongoose.Types.ObjectId('59b29d8e49a8633efc1b8a47'),
                region:region._id,
                replace:mongoose.Types.ObjectId('59b628b7cdb40d11420dc60f')
            });
            court.save(function (err) {
                if (err) console.log(err);
            });
        }
    });
});

module.exports = router;