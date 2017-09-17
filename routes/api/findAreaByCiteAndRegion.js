const express = require('express');
const router = express.Router();
const Area = require('../../models/area-new');
const Region = require('../../models/region-new');
const Court = require('../../models/court-new');
const url = require('url');
var async = require('asyncawait/async');
var await = require('asyncawait/await');

router.get('/', function (req, res) {

    var region = url.parse(req.url, true).query['region'];
    var city = url.parse(req.url, true).query['city'];
    var street = url.parse(req.url, true).query['street'];
    var refinement = url.parse(req.url, true).query['refinement'];

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

                          if (resultAreas.length === 0) {  //
                              console.log('Ничего не найдено');
                              res.status(503).send(JSON.stringify({area:'район не найден', court:{}}));
                          }

                      } else { //маленький город
                          findCourtById(ar[0]._id).then(function (result) {
                              console.log('done'+result);
                              if (result) {
                                  res.send(JSON.stringify({area:ar[0].name.last.ua, court:result}));
                              } else {
                                  res.sendStatus(503); //не нашли маленький город
                              }
                          });


                      }
                  } else { // ищем село
                      Area.find({'region':reg._id}).where('cities.name.last.ua').equals(city).exec(function (err, ar) {
                          if (err) console.log(err);
                          if (ar.length > 1) {   //нашли несколько сел
                              var result = [];
                              //pushElement(null);
                              ar.forEach(function (elem) {
                                  result.push(elem.name.last.ua);
                              });
                              res.send(JSON.stringify(result));  // отправляем список районов
                          }
                          if (ar.length == 1){    //только одно село
                              findCourtById(ar[0]._id).then(function (result) {
                                 console.log('done'+result);
                                 if (result) {
                                     res.send(JSON.stringify({area:ar[0].name.last.ua, court:result}));
                                 } else {
                                     res.sendStatus(503);
                                 }

                              });
                          }
                          if (ar.length ===0){ // не нашли село
                              res.sendStatus(503);
                          }
                      });
                  }
              });

            } else {
                console.log('Область не найдена');
                res.sendStatus(503);
            }
        });
    }


    if (refinement && region && city) {  //пришло уточнение по району
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
                                   if (result) {
                                       res.send(JSON.stringify({area:item.name.last.ua, court:result}));
                                   } else {
                                       res.sendStatus(503);
                                   }

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
                                    if (result) {
                                        res.send(JSON.stringify({area:area.name.last.ua, court:result}));
                                    } else {
                                        res.sendStatus(503);
                                    }

                                });
                            }
                        });
                    }
                });
            }
        });
    }
});


var findCourtById = async (function  (id) {
    return new Promise (function (resolve, reject) {
        Court.findOne({'area':id}, function (err, court) {
            if (err) console.log(err);
            if (court) {
                console.log(court.name.last.ua);
                //result = court.name.last.ua;
                console.log(court.replace);
                if (court.replace !== '000000000000000000000000') {
                    Court.findOne({'_id':court.replace}, function (err, courtReplace) {
                        if (err) console.log(err);
                        if (courtReplace){
                            console.log('replace is :' + courtReplace.name.last.ua);
                            result = courtReplace;
                            resolve(result);
                        }
                    });
                } else {
                    result = court.name.last.ua;
                    resolve(court);
                }
            }
        });
    });
});

module.exports = router;