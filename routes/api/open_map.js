const express = require('express');
const router = express.Router();
const request = require('request');
var parseString = require('xml2js').parseString;
var url = require('url');
const cheerio = require('cheerio');


router.get('/', function (req, res) {
    //var url = encodeURI('http://nominatim.openstreetmap.org/search/?city=Birmingham&country=Great Britain&street=Pilkington%20Avenue&format=xml');
    //var url = encodeURI('http://nominatim.openstreetmap.org/search/?city=Київ&country=Україна&street=1, Перемоги площа&format=xml');
    // var baseUrl = encodeURI('http://nominatim.openstreetmap.org/search/?city=Одесса&country=Україна&street=25 Чапаевской дивизии, 14&format=xml');
    var baseUrl = encodeURI('http://nominatim.openstreetmap.org/search/' +
        '?city=Бар&country=Україна&street=Соборна, 2&state=Вінницька область&format=json&email=tvv.ossystem@gmail.com');
    request(baseUrl, function (err, response, body) {
        var result = JSON.parse(body)[0].display_name;
        result.split(',').forEach(function (elem) {
            if (elem.indexOf('район') !== -1) {
                console.log(elem);
            }
        });
        //console.log(JSON.parse(body)[0].display_name);
        res.send('end');
    });
});



module.exports = router;



