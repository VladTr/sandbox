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
    var home = url.parse(req.url, true).query['home'];
    var refinement = url.parse(req.url, true).query['refinement'];

    var sentMarker = false;
    if (region === 'Автономна Республіка Крим'){
        res.send(JSON.stringify({area:region, court:{
            name:{
                last:{
                    ua:'АПЕЛЯЦІЙНИЙ СУД МІСТА КИЄВА'
                }
            }
        }}));
        return;
    }

    if (region && city && refinement === undefined) {
        console.log(region+' : '+city+'  :  '+street+' :'+home);
        // первоначальный запрос
        Region.findOne({'name.last.ua':region}, function (err, reg) {
            if (err) console.log(err);
            if (reg) {
                console.log(reg.name);
              Area.find({'name.last.ua':city, region:reg._id}).exec(function (err, ar) {  // ищем город большой или маленький
                  if (err) console.log(err);
                  if (ar.length != 0) {
                      if (ar[0].subarea.length !=0) {  // большой город
                          console.log('большой город');
                          var resultSub ={}, resultAreas=[];
                          ar[0].subarea.forEach(function (elem) {
                              console.log('сейчас ищем в =>  '+elem.name.last.ua);
                              elem.streets.forEach(function (inner) {          // поиск улицы в районах
                                  if (inner.name.last.ua == street){
                                      resultSub = elem;
                                      resultAreas.push(elem.name.last.ua);
                                      console.log(elem.name.last.ua);
                                      console.log(elem._id);
                                  }
                              });
                          });
                          console.log(resultAreas.length);
                          if (resultAreas.length === 1) {  // нашли улицу в районе (1 улица - 1 район) и ищем суд по id района в городе (subarea)
                              findCourtById(resultSub._id)
                                  .then(function (result) {
                                    console.log(res.headersSent);
                                    if (!res.headersSent) {
                                      console.log('sent');
                                      res.send(JSON.stringify({area:resultSub.name.last.ua, court:result}));
                                    }})
                                  .catch(function (error) {
                                    console.log(error.message);
                                    res.sendStatus(503);
                                  });
                          }
                          if (resultAreas.length > 1) {  // улица расположена в нескольких районах
                              //тут мы проверяем дома
                              if (home) {
                                  checkHome(city,resultAreas, home)
                                      .then(function (sub) {
                                          if (sub) {
                                              console.log('id: '+sub.id);
                                              findCourtById(sub.id)
                                                  .then(function (result) {
                                                      if (result) {
                                                          console.log(result);
                                                          res.send(JSON.stringify({area:sub.name.last.ua, court:result}));
                                                      }
                                                  })
                                                  .catch(function (error) {
                                                      console.log('поиск улицы по домам к успеху не привел');
                                                      res.send(JSON.stringify(resultAreas));  // отправляем список районов в городе
                                                  });
                                          } else {
                                              res.send(JSON.stringify(resultAreas));  // отправляем список районов в городе
                                          }
                                      });
                              }
                          }
                          if (resultAreas.length === 0) {  // не нашли такой улицы в городе
                              console.log('Ничего не найдено');
                              res.status(503).send(JSON.stringify({area:'район не найден', court:{}}));
                          }

                      } else { //маленький город с городским судом
                          findCourtById(ar[0]._id)
                              .then(function (result) {
                                  console.log('done'+result);
                                  if (result) {
                                      res.send(JSON.stringify({area:ar[0].name.last.ua, court:result}));
                                  } else {
                                      res.sendStatus(503); //не нашли маленький город
                              }})
                              .catch(function (error) {
                                  console.log(error.message);
                                  res.sendStatus(503);
                              });
                      }
                  } else { // ищем село находящееся в области
                      Area.find({'region':reg._id}).where('cities.name.last.ua').equals(city).exec(function (err, ar) {
                          if (err) console.log(err);
                          if (ar.length > 1) {   //нашли несколько сел с одинаковым названием в разных районах
                              var result = [];
                              //pushElement(null);
                              ar.forEach(function (elem) {
                                  result.push(elem.name.last.ua);
                              });
                              res.send(JSON.stringify(result));  // отправляем список районов
                          }
                          if (ar.length == 1){    //нашли только одно село
                              findCourtById(ar[0]._id)
                                  .then(function (result) {
                                    console.log('done'+result);
                                    if (result) {
                                     res.send(JSON.stringify({area:ar[0].name.last.ua, court:result}));
                                    } else {
                                     res.sendStatus(503);
                                    }})
                                  .catch(function (error) {
                                    console.log(error.message);
                                    res.sendStatus(503);
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
                               findCourtById(item._id)
                                   .then(function (result) {
                                       console.log('done'+result);
                                       if (result) {
                                           res.send(JSON.stringify({area:item.name.last.ua, court:result}));
                                       }
                                   })
                                   .catch(function (error) {
                                       console.log(error.message);
                                       res.sendStatus(503);
                                   });
                           }
                        });
                    } else {
                        Area.findOne({'name.last.ua':refinement}, function (err, area) {
                            console.log(area._id);
                            if (err) console.log(err);
                            if (area){
                                findCourtById(area._id)
                                    .then(function (result) {
                                        console.log('done: '+result);
                                        if (result) {
                                            res.send(JSON.stringify({area:area.name.last.ua, court:result}));
                                        }
                                    })
                                    .catch(function (error) {
                                        console.log(error.message);
                                        res.sendStatus(503);
                                    });
                            }
                        });
                    }
                });
            }
        });
    }
});

router.get('/regions', function (req, res) {
   var resultRegions = [];
   var region = url.parse(req.url, true).query['region'];

   if (!region) {
       Region.getAllRegions(function (err, regions) {
           if (err) console.log(err);
           regions.forEach(function (region) {
               resultRegions.push(region.name.last.ua);
           });
           res.send(JSON.stringify(resultRegions));
       });
   } else {
       Region.findOne({'name.last.ua':region}, function (err, reg) {
           if (err) console.log(err);
           var resultCourts = [];
           Court.find({region:reg.id}, function (err, courts) {
               if (err) console.log(err);
               if (courts.length > 1) {
                   courts.forEach(function (court) {
                      resultCourts.push(court.name.last.ua);
                   });
               }
               res.send(JSON.stringify(resultCourts));
           });
       });
   }

});


var findCourtById = function  (id) {
    return new Promise (function (resolve, reject) {
        result = {};
        Court.findOne({'area': id}, function (err, court) {
            if (err) console.log(err);
            if (court) {
                if (court.replace !== '000000000000000000000000') {
                    Court.findOne({'_id': court.replace}, function (err, courtReplace) {
                        if (err) console.log(err);
                        if (courtReplace) {
                            console.log('replace is :' + courtReplace.name.last.ua);
                            result = courtReplace;
                            resolve (result);
                        }
                    });
                }
                if (court.replace == '000000000000000000000000') {
                    console.log ('else');
                    result = court;
                    resolve (result);
                }
            } else {
                reject(new Error('court not found'));
            }

        });
    });
};

function checkHome(city,subs, home){
    return new Promise (function (resolve, reject) {
        var check = false;
        Area.findOne({'name.last.ua':city}, function (err, ar) {
            if (err) console.log(err);
            if (ar) {
                ar.subarea.forEach(function (sub) {
                    if (subs.includes(sub.name.last.ua)){
                        sub.streets.forEach(function (street) {
                            //var regExp = new RegExp(street.regexp, 'g');
                            //console.log(home.search(regExp));
                            if (street.regexp.split(',').includes(home)){
                                console.log(sub._id);
                                resolve(sub);
                                check = true;
                            }
                        });
                    }

                });
            }
            if (!check) {
                resolve(null);
            }
        });
    });
}

// var findCourtById = async (function  (id) {
//     var result= await (Court.findOne({'area':id}, function (err, court) {
//         if (err) console.log(err);
//         if (court) {
//             console.log(court.name.last.ua);
//             result = court.name.last.ua;
//             console.log(court.replace);
//             if (court.replace !== '000000000000000000000000') {
//                 Court.findOne({'_id':court.replace}, function (err, courtReplace) {
//                     if (err) console.log(err);
//                     if (courtReplace){
//                         console.log('replace is :' + courtReplace.name.last.ua);
//                     }
//                 });
//             }
//         }
//     }));
//     return result;
// });

module.exports = router;