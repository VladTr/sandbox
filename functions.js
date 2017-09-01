const cheerio = require('cheerio');
const request = require('postman-request');
var iconv = require('iconv-lite');
var Court = require('./models/court');
var Single = require('./models/singletest');
var Area = require('./models/area-new');
var Region = require('./models/region-new');



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


var realAdd = function (name, list) {
    var cities = [];
    for (var i=0; i<list.length; i++){
        var el = {
            name:{
                last:{
                    ua:list[i]
                }
            }
        };
        cities.push(el);
    }
      // находим область и вставляем
    var xxx = '';
    var city = {
        name:{
            last:{
                ua:'Blah-blah-blah'
            }
        }
    };
    Region.findOne({'name.last.ua': 'Вінницька'}, function (err, region) {
        if (err) {
            console.log(err)
        } else {
            xxx = region;
            //console.log(xxx._id);
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
            //console.log(area._id);
            // Area.findByIdAndUpdate(area._id,
            //     {$push:{cities:city}},
            //     {safe: true, upsert: true, new : true},
            //     function (err, arr) {
            //         if (err) console.log(err);
            // });

            // area.update({cities:{name:{last:{ua:'Blah-blah-blah'}}}}, function (err, raw) {
            //     if (err) console.log(err);
            //     if (raw) console.log(raw);
            // });
            //console.log('Area id:  '+area._id);
            //addListOfCities(area._id);
        }
    });


     // все остальное
};


function addListOfCities(id) {
    var arr = ['11', '22','33'];
    var city = {
      name:{
          last:{
              ua:'Blah-blah-blah'
          }
      }
    };
    Area.findByIdAndUpdate(id, {$push: {cities:city}}, {new:true}, function (err, areaId) {
       if (err) console.log(err);
       console.log(areaId);
    });
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