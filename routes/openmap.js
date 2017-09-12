const express = require('express');
const router = express.Router();
const request = require('request');
var parseString = require('xml2js').parseString;
var url = require('url');
const cheerio = require('cheerio');



router.get('/', function (req, res) {
    //var address = encodeURI('1-й Аэродромный переулок 2');
    //var baseUrl = '/www.openstreetmap.org/search?query=';
    //var baseUrl = 'https://master.apis.dev.openstreetmap.org/api/0.6/notes/search?limit=1&q=';ь, 67733
    //var baseUrl = 'http://www.openstreetmap.org/search?format=json&limit=1';

    //var baseUrl = 'http://nominatim.openstreetmap.org/search?q=135+pilkington+avenue,+birmingham&format=xml&polygon=1&addressdetails=1';


    var address = encodeURI('Казацкое, Белгород-Днестровский район, Одесская область, 67733');
    var baseUrl = 'http://nominatim.openstreetmap.org/search/';
    var queryFormat = '?format=xml&addressdetails=1&limit=2&polygon=0&email=myemail@myserver.com';

        request(baseUrl+address+queryFormat, function (error, response, body) {
        //console.log(baseUrl+address);
        console.log('error:', error); // Print the error if one occurred
        //console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
        console.log(typeof body); // Print the HTML for the Google homepage.
        console.log(body);
            var xml = body;
            parseString(xml, function (err, result) {
                //console.dir(result);
                //console.dir(result.searchresults.place);
            });
        //console.log(body);
        //res.send(typebody);
    });

//var nom = 'http://nominatium.openstreetmap.org/search?format=json$limit=1';
    res.send('ends');

});

router.get('/json', function (req, res) {
    var addresFromUser = (url.parse(req.url, true).query['address']);
    //console.log(addresFromUser);
    //var address = 'Unter%20den%20Linden%201%20Berlin';
    var address = encodeURI(addresFromUser);
    var baseUrl = 'http://nominatim.openstreetmap.org/search/';
    var queryFormat = '?format=json&addressdetails=1&limit=1&polygon_svg=1';
    request(baseUrl+address+queryFormat, function (err, response, body) {
       if (err){
           console.log('error: '+err);
       } else {
           console.log(response);
           //console.log(typeof body);
           //console.log(body);
           //var j = JSON.parse(body);
           //console.log(j[0].display_name);
           //console.log(j);
           //res.send(j[0].display_name);
       }
    });

});

router.get('/test', function (req, res) {
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

router.get('/query', function (req, res) {
    var addresFromUser = encodeURI(url.parse(req.url, true).query['address']);
    console.log(addresFromUser);
    var baseUrl = encodeURI('http://nominatim.openstreetmap.org/search/?format=json&q=');
    //var baseUrl = encodeURI('http://nominatim.openstreetmap.org/search/?q=1 Щорса, Одесса&format=xml');
    request(baseUrl+addresFromUser, function (err, response, body) {
        // const $ = cheerio.load(body);
        // var place = $('place').eq(0);
        //console.log(place);
        //var place = ($('div.col-xs-7.banners > div.col-xs-24').children().eq(4).text()).trim();
        console.log(typeof body);
        console.log(body);
        res.send(body);
    });
    // res.writeHead(302, {
    //     'Location': '/'
    // });
    // res.end();
});


module.exports = router;



