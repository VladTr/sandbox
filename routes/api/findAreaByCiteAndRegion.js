const express = require('express');
const router = express.Router();
const Area = require('../../models/area-new');
const Region = require('../../models/region-new');
const Court = require('../../models/court-new');
const path = require('path');
const url = require('url');
var async = require('asyncawait/async');
var await = require('asyncawait/await');

router.get('/', function (req, res) {

    var region = url.parse(req.url, true).query['region'];
    var city = url.parse(req.url, true).query['city'];
    var street = url.parse(req.url, true).query['street'];

    if (region && city) {
        console.log(region+' : '+city+'  :  '+street);

        Region.findOne({'name.last.ua':region}, function (err, reg) {
            if (err) console.log(err);
            if (reg) {
              Area.find({'name.last.ua':city}).exec(function (err, ar) {  // ищем город большой или маленький
                  if (err) console.log(err);
                  if (ar.length != 0) {
                      if (ar[0].subarea.length !=0) {  // большой город
                          var output='';
                          ar[0].subarea.forEach(function (elem) {
                              //console.log('сейчас ищем в =>  '+elem.name.last.ua);
                              elem.streets.forEach(function (inner) {
                                  if (inner.name.last.ua == street){
                                      console.log(typeof elem._id);
                                      findCourtById(elem._id);
                                      output+=(elem.name.last.ua)+'\n';
                                  }
                              });
                          });

                      } else { //маленький город
                          res.send(ar[0].name.last.ua);

                      }
                      res.send(output);
                  } else {
                      Area.find({'region':reg._id}).where('cities.name.last.ua').equals(city).exec(function (err, ar) {
                          if (err) console.log(err);
                          if (ar.length !=0) {
                              var result = '';
                              ar.forEach(function (elem) {
                                  result+=elem.name.last.ua+' ';
                                  console.log(elem._id);
                                  findCourtById(elem._id);
                              });
                              res.send(result);
                          }
                      });
                  }
              });

            }
        });


    } else {
        res.sendFile(path.join(__dirname, '../../public', 'find-area.html'));
    }

});

router.get('/temp', function (req, res) {
    res.end();
    Area.findOne({'name.last.ua':'Одеса'}, function (err, area) {
        console.log(area);
        area.subarea.forEach(function (item) {
            if (item.name.last.ua == 'Малиновський'){
                item.streets.forEach(function (inner) {
                    console.log(inner.name.last.ua);
                });
            }


        });
    }) ;
});



var findCourtById = function (id) {
    var result= Court.findOne({'area':id}, function (err, court) {

        if (err) console.log(err);
        if (court) {
            console.log(court.name.last.ua);
            result = court.name.last.ua;
        }
    });
    return result;
};

module.exports = router;