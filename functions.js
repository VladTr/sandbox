const cheerio = require('cheerio');
const mongoose = require('mongoose');
const request = require('postman-request');
var iconv = require('iconv-lite');
var Court = require('./models/court-new');
var Single = require('./models/singletest');
var Area = require('./models/area-new');
var Region = require('./models/region-new');
// var ObjectId = mongoose.Schema.ObjectId;


var findInParsedSie = function (body) {
    const $ = cheerio.load(body);

    var address = ($('div.col-xs-7.banners > div.col-xs-24').children().eq(2).text()).trim();
    if (address.indexOf('Адреса')!==-1){
        address = remove(address, address.indexOf('Адреса'), address.indexOf('Адреса')+7);
    }
    var email = ($('div.col-xs-7.banners > div.col-xs-24').children().eq(4).text()).trim();
    if (email.indexOf('E-mail')!==-1){
        email = remove(email, email.indexOf('Адреса'), email.indexOf('E-mail')+7);
    }
    var phone = ($('div.col-xs-7.banners > div.col-xs-24').children().eq(5).text()).trim();
    if (phone.indexOf('Телефони')!==-1){
        phone = remove(phone, phone.indexOf('Адреса'), phone.indexOf('E-mail')+10);
    }
    var courtInfo = {
        name: ($('div.ust span').text()).trim(),
        address: address,
        site: ($('div.col-xs-7.banners > div.col-xs-24').children().eq(3).text()).trim(),
        email: email,
        phone: phone
    };
    return courtInfo;
};


var postAndSave2 = function (formData, headers, regionCurrent, areaCurrent, court_type) {
    return function (resolve, reject) {

        request.post({
            url:'http://court.gov.ua/sudova-vlada/sudy',
            form:formData,
            headers: headers
        }, function (err, httpResponse, body) {
            if (err) {
                console.log(err);
            }
            if (httpResponse){
                request(
                    {
                        url:httpResponse.headers.location,
                        encoding:null,
                        // timeout:9000
                    },
                    function(err,res,body){
                        console.log(httpResponse.headers.location);
                        if (!body){
                            console.log(regionCurrent+'/'+areaCurrent);
                            reject(httpResponse.headers.location);
                        }
                        var record = findInParsedSie((iconv.decode(body, 'win1251')).toString());
                        Court.findOne({'name.last.ua':record.name}, function (err, court) {
                            if (err) console.log(err);
                            if (court) court.remove();
                        });
                        var court = new Court({
                            name:{
                                last:{
                                    ua:record.name
                                }
                            },
                            spec:court_type,
                            address: record.address,
                            phone: record.phone,
                            email: record.email,
                            replace: new mongoose.Types.ObjectId('000000000000000000000000')
                        });

                        if (court_type != 8) {
                            Area.findOne({'name.last.ua':areaCurrent}, function (err, area) {
                                if (err) console.log(err);
                                if (area) {
                                    //console.log('area id: '+area._id);
                                    //console.log('type of: '+ typeof area);
                                    court.area=area._id;
                                    Region.findOne({'name.last.ua':regionCurrent}, function (err, region) {
                                        if (err) console.log(err);
                                        if (region) {
                                            court.region=region._id;
                                            court.save();
                                            resolve();
                                        }
                                    });
                                }
                            })   ;
                        } else {
                            //console.log('court_type = '+court_type);
                            Region.findOne({'name.last.ua':regionCurrent}, function (err, region){
                                if (region) {
                                    court.region=region._id;
                                    console.log(region._id);
                                    console.log(areaCurrent);
                                    Area.find({'subarea.name.last.ua':areaCurrent, 'region':region._id}).exec(cb);
                                    function cb (err, area){
                                        if (err) console.log(err);
                                        console.log(area);
                                        // if (area) console.log(area[0].name.last.ua);
                                        // if (area) console.log(area[0].region);
                                        console.log(' --> '+areaCurrent);
                                        if (area) {
                                            area[0].subarea.forEach(function (item) {
                                                if (item.name.last.ua == areaCurrent){
                                                    //console.log(item.name.last.ua);
                                                    //console.log(item._id);
                                                    court.area = item._id;
                                                    court.save();
                                                    resolve();
                                                }
                                            });
                                        }
                                    }
                                }
                            });
                        }
                    }
                );
            }
        });
    }
};


// var postAndSave2 = function (formData, headers, regionCurrent, areaCurrent, court_type) {
//     console.log(regionCurrent+'/'+areaCurrent);
//     request.post({
//         url:'http://court.gov.ua/sudova-vlada/sudy',
//         form:formData,
//         headers: headers
//     }, function (err, httpResponse, body) {
//         if (err) {
//             console.log(err);
//         }
//         if (httpResponse){
//             request(
//                 {
//                     url:httpResponse.headers.location,
//                     encoding:null,
//                     // timeout:9000
//                 },
//                 function(err,res,body){
//                     //console.log(httpResponse.headers.location);
//
//                     var record = findInParsedSie((iconv.decode(body, 'win1251')).toString());
//                     Court.findOne({'name.last.ua':record.name}, function (err, court) {
//                        if (err) console.log(err);
//                        if (court) court.remove();
//                     });
//                     var court = new Court({
//                         name:{
//                             last:{
//                                 ua:record.name
//                             }
//                         },
//                         spec:court_type,
//                         address: record.address,
//                         phone: record.phone,
//                         email: record.email,
//                         replace: new mongoose.Types.ObjectId('000000000000000000000000')
//                     });
//
//                     if (court_type != 8) {
//                         Area.findOne({'name.last.ua':areaCurrent}, function (err, area) {
//                             if (err) console.log(err);
//                             if (area) {
//                                 //console.log('area id: '+area._id);
//                                 //console.log('type of: '+ typeof area);
//                                 court.area=area._id;
//                                 Region.findOne({'name.last.ua':regionCurrent}, function (err, region) {
//                                     if (err) console.log(err);
//                                     if (region) {
//                                         court.region=region._id;
//                                         court.save();
//                                     }
//                                 });
//                             }
//                         })   ;
//                     } else {
//                         //console.log('court_type = '+court_type);
//                         Region.findOne({'name.last.ua':regionCurrent}, function (err, region){
//                             if (region) {
//                                 court.region=region._id;
//                                 Area.find({'subarea.name.last.ua':areaCurrent}).where('region').equals(region._id).exec(cb);
//                                 function cb (err, area){
//                                     if (err) console.log(err);
//                                     //if (area) console.log(area[0].name.last.ua);
//                                     //if (area) console.log(area[0].region);
//                                     console.log(' --> '+areaCurrent);
//                                     if (area) {
//                                         area[0].subarea.forEach(function (item) {
//                                             if (item.name.last.ua == areaCurrent){
//                                                 //console.log(item.name.last.ua);
//                                                 //console.log(item._id);
//                                                 court.area = item._id;
//                                                 court.save();
//                                             }
//                                         });
//                                     }
//                                 }
//                             }
//                         });
//                     }
//                 }
//             );
//         }
//     });
// };

var postAndSave = function (formData, headers, key, reg, court_type) {
    request.post({
        url:'http://court.gov.ua/sudova-vlada/sudy',
        form:formData,
        headers: headers
    }, function (err, httpResponse, body) {
        if (err) {
            console.log(err);
        }
        if (httpResponse){
            request(
                {
                    url:httpResponse.headers.location,
                    encoding:null
                },
                function(err,res,body){

                    var record = findInParsedSie((iconv.decode(body, 'win1251')).toString());

                    var court = new Court({
                        name:{oldName:'old name', newName:record.name},
                        area:{oldName:'old name area', newName:reg.split('/')[0]},
                        region: reg.split('/')[1],
                        type:court_type,
                        address: record.address,
                        phone: record.phone,
                        email: record.email
                    });

                    court.save(function (err) {
                        if (err){

                            return console.log(err+'--error---'+key+'  :  '+region);
                        }
                        //console.log(record);
                    });
                }
            );
        }
    });
};

var singleAdd = function (name, list) {
    var sin = new Single({
        name:name,
        list:list
    });
    sin.save(function (err) {
        if (err) console.log(err);
    })
};

var realAdd = function (name, list, currentRegion) {
    console.log(name);
    var cities = [];
    for (var i=0; i<list.length; i++){
        var city = {
            name:{
                last:{
                    ua:list[i]
                }
            }
        };
        cities.push(city);
    }
      // находим область и вставляем
    Region.findOne({'name.last.ua': currentRegion}, function (err, region) {
        if (err) {
            console.log(err)
        } else {
            //тут проверяем есть ли уже такой регион - если есть - обновляем данные, если нет вставляем
            Area.findOneAndUpdate({'name.last.ua':name, region:region._id},{$set:{cities:cities}}, function(err, ar){
                if (err) console.log(err);
                if (ar) {
                    console.log('район уже есть: '+ar.name.last.ua);
                } else {
                    var area = new Area ({
                        name:{
                            last:{
                                ua:name
                            }
                        },
                        region:region._id,
                        cities:cities
                    });
                    area.save(function (err) {
                        if (err) console.log(err)
                    });
                }
            });

        }
    });
};

var findRegionAndAddCity = function(region, city){
    Region.findOne({'name.last.ua':region}, function (err, region) {
        var area = {};
        if (err) console.log(err);
        if (region) {
            // тут ищем есть ли уже такой город и если нет добавляем
            Area.findOne({'name.last.ua':city, 'region':region._id}, function (err, ar) {
                if (err) console.log(err);
                if (!ar) {
                    area = new Area({
                        name: {
                            last:{
                                ua:city
                            }
                        },
                        region:region._id
                    });
                    area.save(function (err) {
                        if (err) console.log(err);
                    });
                    console.log('добавили город: '+area.name.last.ua);
                } else {
                    console.log('город уже есть: '+ar.name.last.ua);
                }
            });
        }
    });
};

var addSubareaWithStreets = function (region, area, subarea) {
    var areaInfo = {};
    //console.dir(subarea);
    var promise = new Promise(function (resolve, reject) {
        Region.findOne({'name.last.ua': region}, function (err, reg) {
            if (err) console.log(err);
            if (reg) {
                // тут мы проверяем есть ли уже данный город и если нет то добавляем его
                Area.findOne({'name.last.ua': area, 'region': reg._id}, function (err, ar) {
                    if (err) console.log(err);
                    if (ar) {
                        ar.remove();
                        pushCitiesToSubArea(reg, area, subarea);
                        resolve();
                    } else {
                        pushCitiesToSubArea(reg, area, subarea);
                        resolve();
                    }
                });
            }
        }).then(function () {
            console.log('done');
        });
    });
};

function pushCitiesToSubArea(region, area, subarea) {
    var ar = new Area(
        {
            name:{
                last:{
                    ua:area
                }
            },
            region:region.id
        }
    );
    ar.save(function (err) {
        if (err) console.log(err);
    });
    console.log(region);
    console.log('район '+ar.name.last.ua+'   /регион'+ar.region);
    subarea.forEach(function (el) {
        //console.log(el.name);
        ar.subarea.push({
            name:{
                last:{
                    ua:el.name
                }
            }
        });

    });

    ar.subarea.forEach(function (el) {
        subarea.forEach(function (inner) {
            if (inner.name == el.name.last.ua){
                inner.streets.forEach(function (item) {
                    el.streets.push({
                        name:{
                            last:{
                                ua:item.name.last.ua
                            },
                            old:{
                                ua:item.name.old.ua
                            }
                        },
                        regexp:item.regexp
                    });
                    //console.log(el.streets);
                });
            }
        });
    });

    ar.save(function(err){if(err)console.log(err)});
}


var saveStreetToSubarea = function (region, area, subarea, street, home) {
    var promise = new Promise (function (resolve, reject) {
        Region.findOne({'name.last.ua':region}, function (err, reg) {
            if (err) console.log(err);
            if (reg) {
                resolve(reg);
            }
        }).then(function (reg) {
           Area.findOne({'name.last.ua':area, region:reg._id}, function (err, ar) {
              if (err) console.log(err);
              if (ar) {
                  ar.subarea.forEach(function (item) {
                      if (subarea.indexOf('’')!==-1) {
                          subarea = subarea.substring(0,subarea.indexOf('’'))+"'"+subarea.substring(subarea.indexOf('’')+1);
                      }
                      if (item.name.last.ua === subarea) {
                         if (checkIfStreetAlreadyExist(item.streets, street)){
                             item.streets.push({
                                 name:{
                                     last:{
                                         ua:street
                                     }
                                 },
                                 regexp:'.*'
                             });
                         } else {
                             item.streets.forEach(function (elStreet) {
                                 if (elStreet.name.last.ua === street ) {
                                     if (elStreet.regexp.split(',').includes(home)){
                                         console.log('номер уже там');
                                     } else {
                                         elStreet.regexp+=','+home;
                                     }

                                 }
                             });
                         }
                     }
                  });
                  ar.save(function (err) {
                     if (err) console.log(err);
                  });
              }
           });
        });
    });
};

function checkIfStreetAlreadyExist(streets, street) {
    for (var i=0; i<streets.length; i++){
        if (streets[i].name.last.ua === street){
            console.log('Already exist');
            return false;
        }
    }
    console.log('Not exist / added');
    return true;
}

function remove(str, start, end) {
    var before = str.substring(0, start);
    var after = str.substring(end, str.length);
    return before+after;
}


module.exports.findInParsedSie = findInParsedSie;
module.exports.postAndSave = postAndSave;
module.exports.singleAdd = singleAdd;
module.exports.realAdd = realAdd;
module.exports.postAndSave2 = postAndSave2;
module.exports.findRegionAndAddCity = findRegionAndAddCity;
module.exports.addSubareaWithStreets = addSubareaWithStreets;
module.exports.saveStreetToSubarea = saveStreetToSubarea;

