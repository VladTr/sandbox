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
                          var output = '';
                          ar[0].subarea.forEach(function (elem) {
                              output+=elem.name.last.ua+'\n';
                          });
                          res.send(output);
                          console.log(output);
                      } else { //маленький город
                          res.send(arr[0].name.last.ua);
                      }
                  } else {
                      Area.find({'region':reg._id}).where('cities.name.last.ua').equals(city).exec(function (err, ar) {
                          if (err) console.log(err);
                          if (ar.length !=0) {
                              var result = '';
                              ar.forEach(function (elem) {
                                  result+=elem.name.last.ua+' ';
                              });
                              res.send(result);
                          }
                      });
                  }
              });

            }
            //     Area.find({'region':reg._id}).where('cities.name.last.ua').equals(city).exec(function (err, ar) {
            //         if (err) console.log(err);
            //         if (ar) {
            //             console.log(ar);
            //             var result = '';
            //             ar.forEach(function (elem) {
            //                 result+=elem.name.last.ua+' ';
            //             });
            //             res.send(result);
            //         } else {
            //             res.send('получить район не удалось')
            //         }
            //
            //     });
            // }
        });


    } else {
        res.sendFile(path.join(__dirname, '../../public', 'find-area.html'));
    }

});




module.exports = router;