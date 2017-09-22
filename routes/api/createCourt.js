var express = require('express');
var Court = require('../../models/court-new');
var Region = require('../../models/region-new');
var mongoose = require('mongoose');


    Region.findOne({'name.last.ua':'Київська'}, function (err, region) {
        if (err) console.log(err);
        if (region){
            var court = new Court({
                name:{
                    last:{
                        ua:'Поліський районний суд Київської області (скасований)'
                    }
                },
                area:mongoose.Types.ObjectId('59be6a4101e4a5007c6889ae'),
                region:region._id,
                replace:mongoose.Types.ObjectId('000000000000000000000000')
            });
            court.save(function (err) {
                if (err) console.log(err);
            });
        }
    });

