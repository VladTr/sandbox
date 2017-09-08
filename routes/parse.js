const express = require('express');
const router = express.Router();
const Court = require('../models/court-old');
var areaCurrent = require('../data/8');
var func = require('../functions');
var court_type = 8;
router.get('/', function (req, res) {
    res.send('parse');

// var totalData = [
//     {areaCurrent:require('../data/5'), court_type:5},
//     {areaCurrent:require('../data/6'), court_type:6},
//     {areaCurrent:require('../data/7'), court_type:7},
//     {areaCurrent:require('../data/8'), court_type:8}
// ];

// 5-районы в области      6-міськрайонні     7-міські    8 - районы в городе
    //var court_type, areaCurrent;
    // totalData.forEach(function (item) {
    //     court_type = item.court_type;
    //     areaCurrent = item.areaCurrent;

        for (var key in areaCurrent){
            var area = areaCurrent[key].split('/')[0];
            var region = areaCurrent[key].split('/')[1];
            var code = key.slice(1);
            var formData = {
                reg_id:code,
                court_type:court_type,
                foo1: 1,
                foo2: 73,
                goto:''
            };
            var headers = {
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.8; rv:24.0) Gecko/20100101 Firefox/24.0',
                'Content-Type' : 'application/x-www-form-urlencoded'
            };

            func.postAndSave2(formData,headers,region,area,court_type);
        }
    // });


});





module.exports = router;