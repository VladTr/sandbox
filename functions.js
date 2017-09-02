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
    console.log(regionCurrent+'/'+areaCurrent);
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
                        name:{
                            last:{
                                ua:record.name
                            }
                        },
                        spec:court_type,
                        address: record.address,
                        phone: record.phone,
                        email: record.email
//----------------------------
                        //test:getAreaId('Великомихайлівський')
                        //area:mongoose.Types.ObjectId('59aa7a9913569106a828340f')
                        // region: reg.split('/')[1],
                        // type:court_type,
                        // address: record.address,
                        // phone: record.phone,
                        // email: record.email
                    });


                    var promise = new Promise(function (resolve, reject) {
                        Area.findOne({'name.last.ua':areaCurrent}, function (err, area) {
                            if (err) console.log(err);
                            if (area) {
                                console.log('area id: '+area._id);
                                console.log('type of: '+ typeof area);
                                court.area=area._id;
                                court.save();
                                resolve();
                            }
                        });
                    }).then(function () {
                        //console.log('ress  '+ress);
                        Region.findOne({'name.last.ua':regionCurrent}, function (err, region) {
                            if (err) console.log(err);
                            if (region) {
                                court.region=region._id;
                                court.save();
                            }
                        });
                    });


                    // var areaId = getAreaId('Ананьївський');
                    // console.log('result: '+areaId);
                    // court.area = mongoose.Types.ObjectId('59aa7a9913569106a828340f');
                    // court.test = {a:1};
                    // //court.test = getAreaId('Великомихайлівський');
                    // console.log('court test '+court.test);
                    // court.save(function (err) {
                    //     if (err){
                    //
                    //         return console.log(err+'--error---'+key+'  :  '+region);
                    //     }
                    //     //console.log(record);
                    // });
                }
            );
        }
    });
};

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
            var area = new Area ({
                test:'old',
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
};


function remove(str, start, end) {
    var before = str.substring(0, start);
    var after = str.substring(end, str.length);
    return before+after;
}

function getRegionId(regionName) {
 Region.findOne({'name.last.ua':regionName}, function (err, region) {
     if (err) console.log(err);
     if (region) {
         console.log('region id: '+region._id);
         console.log('type of: '+ typeof region._id);
         return region._id;
     }
 });
}

function getAreaId(areaName) {
    var resultT = '-----';
    var promise = new Promise(function (resolve, reject) {

        Area.findOne({'name.last.ua':areaName}, function (err, area) {
            console.log('resultT '+resultT);
            if (err) console.log(err);
            if (area) {
                console.log('area id: '+area._id);
                console.log('type of: '+ typeof area);
            }
            resultT = '++++++++';
        });
        resolve(resultT);
    }).then(function (resultT) {
        return String(resultT);
    });
}

module.exports.findInParsedSie = findInParsedSie;
module.exports.postAndSave = postAndSave;
module.exports.singleAdd = singleAdd;
module.exports.realAdd = realAdd;
module.exports.postAndSave2 = postAndSave2;


// var promise = new Promise(function (resolve, reject) {
//     var ress = '';
//     Area.findOne({'name.last.ua':areaName}, function (err, area) {
//         console.log('resultT '+resultT);
//         if (err) console.log(err);
//         if (area) {
//             console.log('area id: '+area._id);
//             console.log('type of: '+ typeof area);
//             ress = area._id;
//         }
//     });
//     resolve(ress);
// }).then(function (ress) {
//     court.test={a:89};
//     court.save();
// });