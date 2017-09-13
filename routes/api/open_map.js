const express = require('express');
const router = express.Router();
const request = require('request');
const util = require('util');
var url = require('url');
var func = require('../../functions');

router.get('/', function (req, res) {
    var region = url.parse(req.url, true).query['region'];
    var city = url.parse(req.url, true).query['city'];
    var street = url.parse(req.url, true).query['street'];
    if (region && city && street){
        console.log(region+' : '+city+'  :  '+street);
    }
    //var url = encodeURI('http://nominatim.openstreetmap.org/search/?city=Birmingham&country=Great Britain&street=Pilkington%20Avenue&format=xml');
    //var url = encodeURI('http://nominatim.openstreetmap.org/search/?city=Київ&country=Україна&street=1, Перемоги площа&format=xml');
    // var baseUrl = encodeURI('http://nominatim.openstreetmap.org/search/?city=Одесса&country=Україна&street=25 Чапаевской дивизии, 14&format=xml');
    // var baseUrl = encodeURI('http://nominatim.openstreetmap.org/search/' +
    //     '?city=Бар&country=Україна&street=Соборна, 2&state=Вінницька область&format=json&email=tvv.ossystem@gmail.com');


    // region = 'Вінницька область';
    // city = 'Бар';
    // street = 'Соборна';

    var baseUrl = 'http://nominatim.openstreetmap.org/search/?format=json&email=tvv.ossystem@gmail.com';
    var address = '&country=Україна&state='+region+'&city='+city+'&street='+street;

    console.log(encodeURI(baseUrl+address));

    request(encodeURI(baseUrl+address), function (err, response, body) {
        if (err) console.log(err);
        if (body){
            try {
                //res.send(body);
                var area = '';
                var temp = JSON.parse(body);
                temp.every(function (item) {
                    area = item.display_name;
                    return (item.name === 'building');
                });
            } catch (error) {
                console.log(error.message);
                throw new Error('json error');
            }

            var regexp = /[\wаA-яёї]+ район/i;
            if (area.match(regexp)){
                console.log(area.match(regexp)[0]);
                console.log(street);
                res.send(area.match(regexp)[0]+'<br>Полный адрес: '+area);
                func.saveStreetToSubarea(region, city, area.match(regexp)[0].split(' ')[0],street);
            } else {
                res.status(503).send('Район получить не удалось');
            }
        }
    });
});



module.exports = router;



