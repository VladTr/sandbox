const cheerio = require('cheerio');
const request = require('postman-request');
var iconv = require('iconv-lite');
var Court = require('./models/court-new');
var Single = require('./models/singletest');
var Area = require('./models/area-new');
var Region = require('./models/region-new');
var ObjectId = mongoose.Schema.ObjectId;


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

var postAndSave2 = function (formData, headers, key, reg, court_type) {
    getRegionId('Одеська');
    getAreaId('Великомихайлівський');
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

                        area:getAreaId('Великомихайлівський')
                        // region: reg.split('/')[1],
                        // type:court_type,
                        // address: record.address,
                        // phone: record.phone,
                        // email: record.email
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
         return region._id;
     }
 });
}

function getAreaId(areaName) {
 Area.findOne({'name.last.ua':areaName}, function (err, area) {
     if (err) console.log(err);
     if (area) {
         console.log('area id: '+area._id);
         return area._id
     }
 });
}

module.exports.findInParsedSie = findInParsedSie;
module.exports.postAndSave = postAndSave;
module.exports.singleAdd = singleAdd;
module.exports.realAdd = realAdd;
module.exports.postAndSave2 = postAndSave2;