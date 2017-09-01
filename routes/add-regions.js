const express = require('express');
const router = express.Router();
var regions = require('../data/regions-all');
var Region = require('../models/region-new');


router.get('/', function (req, res) {
    res.send('add regions');
    for(var i=0; i<regions.length; i++){
        //console.log(regions[i].name);
        var reg = new Region({
            name:{
                last:{
                    ua:regions[i].name
                }
            }
        });
        reg.save(function (err) {
           if (err) console.log(err);
        });
    }

});

module.exports = router;