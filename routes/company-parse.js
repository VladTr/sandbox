const express = require('express');
const router = express.Router();
const request = require('postman-request');
const cheerio = require('cheerio');

router.get('/', function (req, res) {
    res.send('company');


    request(
        {
            url:'https://odnodata.com/ukr_uo/massreg/kiev'
        },
        function(err,head,body){
            if (err) console.error('There was an error', err);
            var $ = cheerio.load(body);
            var linkNumbers = $('td > a').length;
            var link = $('td > a').eq(0).attr('href');
            console.log(linkNumbers);
            request({url:link}, function (err,head,body) {

            });
        }
    );

});

module.exports = router;