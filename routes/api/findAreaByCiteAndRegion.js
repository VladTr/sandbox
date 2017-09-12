const express = require('express');
const router = express.Router();
const Area = require('../../models/area-new');
const Region = require('../../models/region-new');
const Court = require('../../models/court-new');
const path = require('path');
const url = require('url');
var async = require('asyncawait/async');
var await = require('asyncawait/await');

var resultArray=[];

router.get('/', function (req, res) {

    console.log('обратились к странице');

    var region = url.parse(req.url, true).query['region'];
    var city = url.parse(req.url, true).query['city'];
    var street = url.parse(req.url, true).query['street'];
    var refinement = url.parse(req.url, true).query['refinement'];

    if (refinement && resultArray.length !==0){
        resultArray.forEach(function (elem) {
           console.log('!!!  '+elem.name.last.ua);
           console.log(refinement);
           if (elem.name.last.ua == refinement) {
               findCourtById(elem._id).then(function (result) {
                   res.send(JSON.stringify({area:'area!!!', court:result}));
                   refinement='';
               });
           }
        });
    }


    if (region && city && refinement === undefined) {
        console.log(region+' : '+city+'  :  '+street);
        console.log('уточнение:' +refinement);

        Region.findOne({'name.last.ua':region}, function (err, reg) {
            if (err) console.log(err);
            if (reg) {
              Area.find({'name.last.ua':city}).exec(function (err, ar) {  // ищем город большой или маленький
                  if (err) console.log(err);
                  if (ar.length != 0) {
                      if (ar[0].subarea.length !=0) {  // большой город
                          console.log('большой город');
                          var resultSub ={}, resultAreas=[];
                          ar[0].subarea.forEach(function (elem) {
                              console.log('сейчас ищем в =>  '+elem.name.last.ua);
                              elem.streets.forEach(function (inner) {
                                  if (inner.name.last.ua == street){
                                      resultSub = elem;
                                      resultAreas.push(elem.name.last.ua);
                                      console.log(elem.name.last.ua);
                                      console.log(elem._id);
                                  }
                              });
                          });
                          console.log(resultAreas.length);
                          if (resultAreas.length === 1) {
                              findCourtById(resultSub._id).then(function (result) {
                                  console.log(res.headersSent);
                                  if (!res.headersSent) {
                                      console.log('sent');
                                      res.send(JSON.stringify({area:resultSub.name.last.ua, court:result}));
                                  }
                              });
                          }
                          if (resultAreas.length > 1) {
                              res.send(JSON.stringify(resultAreas));  // отправляем список районов в городе
                          }

                          //res.send(JSON.parse(output));
                          // if (2===2) { // не нашли по улице
                          //     console.log('2=2');
                          //     ar[0].subarea.forEach(function (sub) {
                          //        if (sub.name.last.ua == 'Деснянський'){
                          //            console.log(sub.name.last.ua);
                          //            sub.streets.push(
                          //                {
                          //                    name:{
                          //                        last:{
                          //                            ua:'--0--'
                          //                        }
                          //                    }
                          //                }
                          //            );
                          //        }
                          //     });
                          //     ar[0].save();
                          // }
                      } else { //маленький город
                          //res.send(JSON.parse(ar[0].name.last.ua));
                          findCourtById(ar[0]._id).then(function (result) {
                              console.log('done'+result);
                              res.send(JSON.stringify({area:ar[0].name.last.ua, court:result}));
                          });


                      }
                  } else { // село
                      Area.find({'region':reg._id}).where('cities.name.last.ua').equals(city).exec(function (err, ar) {
                          if (err) console.log(err);
                          if (ar.length > 1) {   //нашли несколько сел
                              var result = [];
                              pushElement(null);
                              ar.forEach(function (elem) {
                                  result.push(elem.name.last.ua);
                              });
                              res.send(JSON.stringify(result));  // отправляем список районов
                          }
                          if (ar.length == 1){    //только одно село
                              findCourtById(ar[0]._id).then(function (result) {
                                 console.log('done'+result);
                                 res.send(JSON.stringify({area:ar[0].name.last.ua, court:result}));
                              });
                          }
                      });
                  }
              });

            }
        });


    } else {
        //res.sendFile(path.join(__dirname, '../../public', 'find-area.html'));
    }


    if (refinement && region && city) {
        console.log('пришло уточнение');
        console.log(region + ' : ' + city + '  :  ' + refinement);
        Region.findOne({'name.last.ua': region}, function (err, reg) {
            if (err) console.log(err);
            if (reg) {
                Area.findOne({'name.last.ua': city}).exec(function (err, area) {
                    if (err) console.log(err);
                    if (area) {
                        area.subarea.forEach(function (item) {
                           if (item.name.last.ua == refinement){
                               findCourtById(item._id).then(function (result) {
                                   console.log('done'+result);
                                   res.send(JSON.stringify({area:item.name.last.ua, court:result}));
                               });
                           }
                        });
                    } else {
                        console.log('Petrivka');
                        Area.findOne({'name.last.ua':refinement}, function (err, area) {
                            console.log(area._id);
                            if (err) console.log(err);
                            if (area){
                                findCourtById(area._id).then(function (result) {
                                    console.log('done: '+result);
                                    res.send(JSON.stringify({area:area.name.last.ua, court:result}));
                                });
                            }
                        });
                    }
                });
            }
        });
    }
        // Area.find({'name.last.ua':refinement}).populate('region').exec(function (err, area) {
        //     if (err) console.log(err);
        //     console.log(area.length);
        //     if (area){
        //         area.forEach(function (elem) {
        //             if (elem.region.name.last.ua === region) {
        //                 findCourtById(elem._id).then(function (result) {
        //                     console.log('done'+result);
        //                     res.send(JSON.stringify({area:elem.name.last.ua, court:result}));
        //                 });
        //             }
        //         });
        //     }
        //     if (area.length === 0) {
        //         console.log('search....');
        //         Area.findOne({'subarea.name.last.ua':refinement}).populate('region').exec(function (err, arr) {
        //             if (err) console.log(err);
        //             if (arr && arr.region.name.last.ua===region) {
        //                 arr.subarea.forEach(function (item) {
        //                     if (item.name.last.ua === refinement){
        //                         console.log(item._id);
        //                         findCourtById(item._id).then(function (result) {
        //                             console.log('done: '+result);
        //                             //res.send(JSON.stringify({area:elem.name.last.ua, court:result}));
        //                         });
        //                     }
        //                 });
        //
        //             }
        //         });
        //     }
        // });



    // if (refinement && region && city) {
    //     console.log('пришло уточнение');
    //     console.log(region+' : '+city+'  :  '+refinement);
    //     Area.find({'name.last.ua':refinement}).populate('region').exec(function (err, area) {
    //        if (err) console.log(err);
    //        console.log(area.length);
    //        if (area){
    //            area.forEach(function (elem) {
    //               if (elem.region.name.last.ua === region) {
    //                   findCourtById(elem._id).then(function (result) {
    //                       console.log('done'+result);
    //                       res.send(JSON.stringify({area:elem.name.last.ua, court:result}));
    //                   });
    //               }
    //            });
    //        }
    //        if (area.length === 0) {
    //            console.log('search....');
    //            Area.findOne({'subarea.name.last.ua':refinement}).populate('region').exec(function (err, arr) {
    //                if (err) console.log(err);
    //                if (arr && arr.region.name.last.ua===region) {
    //                    arr.subarea.forEach(function (item) {
    //                       if (item.name.last.ua === refinement){
    //                           console.log(item._id);
    //                           findCourtById(item._id).then(function (result) {
    //                               console.log('done: '+result);
    //                               //res.send(JSON.stringify({area:elem.name.last.ua, court:result}));
    //                           });
    //                       }
    //                    });
    //
    //                }
    //            });
    //        }
    //     });
    // }

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



var findCourtById = async (function  (id) {
    var result= await (Court.findOne({'area':id}, function (err, court) {
        if (err) console.log(err);
        if (court) {
            console.log(court.name.last.ua);
            result = court.name.last.ua;
            console.log(court.replace);
            if (court.replace !== '000000000000000000000000') {
                Court.findOne({'_id':court.replace}, function (err, courtReplace) {
                    if (err) console.log(err);
                    if (courtReplace){
                        console.log('replace is :' + courtReplace.name.last.ua);
                    }
                });
            }
        }
    }));
    return result;
});




var pushElement = function(el){
  if (el == null) {
      resultArray = [];
  } else {
      resultArray.push(el);
  }
};


var addStreet = function (id, street) {

};


module.exports = router;