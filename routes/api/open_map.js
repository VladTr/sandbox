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
    var home = url.parse(req.url, true).query['home'];
    if (region && city && street){
        console.log(region+' : '+city+'  :  '+street+'  :  '+home);
    }

    var baseUrl = 'http://nominatim.openstreetmap.org/search/?format=json&email=tvv.ossystem@gmail.com';
    var address = '&country=Україна&city='+city+'&street='+street+' '+home/*+'&state='+region*/;
    //console.log(encodeURI(baseUrl+address));
    // var baseUrl ='http://nominatim.openstreetmap.org/search/ua/Київ/Хрещатик/1?format=json&polygon=1&addressdetails=1&email=tvv.ossystem@gmail.com';
    // var address ='';
    request(encodeURI(baseUrl+address), function (err, response, body) {
        if (err) console.log(err);
        console.log(body);
        if (body){
            try {
                var area = '';
                var temp = JSON.parse(body);
                // temp.every(function (item) {
                //     area = item.display_name;
                //     return (item.class === 'highway');
                // });
                temp.every(function (item) {
                    area = item.display_name;
                    return (item.name === 'building');
                });

            } catch (error) {
                console.log(error.message);
                throw new Error('json error');
            }

            var regexp = /[-\wаA-яґіёїє'"`’]+ район/i;
            if (area.match(regexp)){
                console.log(area.match(regexp)[0]);
                console.log(street);
                var address = area.match(regexp)[0]+'<br>Полный адрес: '+area;
                res.send(JSON.stringify({address:address}));
                func.saveStreetToSubarea(region, city, area.match(regexp)[0].split(' ')[0],street, home);
            } else {
                res.status(503).send(JSON.stringify({address:'Район получить не удалось'}));
            }
        }
    });
});



module.exports = router;



