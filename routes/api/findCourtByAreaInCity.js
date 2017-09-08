const express = require('express');
const router = express.Router();
const Area = require('../../models/area-new');
const Region = require('../../models/region-new');
const Court = require('../../models/court-new');
const path = require('path');
const url = require('url');
var async = require('asyncawait/async');
var await = require('asyncawait/await');

router.get('/subarea', function (req, res) {
    var region = (url.parse(req.url, true).query['region']);
    var subarea = (url.parse(req.url, true).query['subarea']);

    if (region && subarea) {
        console.log(region+' : '+subarea);
        Region.findOne({'name.last.ua':region}, function (err, reg) {
            if (err) console.log(err);
            if (reg) {
                Area.findOne({'region':reg._id}, function (err, area) {
                    if (err) console.log(err);
                    if (area) {
                        area.subarea.forEach(function (elem) {
                            if (elem.name.last.ua === subarea) {
                                console.log(elem.name.last.ua);
                                console.log(elem._id);


                                    findCourtById(elem._id).then(
                                      function (result) {
                                          console.log(result);
                                          res.send(result.name.last.ua);
                                      }  
                                    );

                                    //async(res.send(await(findCourtById(elem._id))));
                                    //console.log('!!!!'+result);
                                    //res.send(result);


                            }
                        });
                    }
                });
            }
        });


    } else {
        res.sendFile(path.join(__dirname, '../../public', 'find-court.html'));
    }
    // var region = 'Одеська';
    // var subarea = 'Київський';





    // Area.find({'name.last.ua':'Херсон'}, function (err, area) {
    //     console.log(area);
    // });


    // Area.find({subarea:{$gt: []}}).
    // where({'name.last.ua':'Одеса'}).
    // //Area.find({subarea:{$not: {$size:0}}}).
    // //where('subarea').equals([]).
    // exec(callback);

    // Area.find({'subarea.name.last.ua':'Малиновський'}).
    // exec(callback);
    //
    // Area.find({'subarea.streets.name.last.ua':'Канатна'}).
    // exec(callback);

    //Area.search('Львів', callback2);

//----------------------------------------------------------------------------------------
    // var promise = new Promise (function (resolve, reject) {
    //     Region.findOne({'name.last.ua':'Одеська'}, function (err, region){
    //         if (region) {
    //             var id = region._id;
    //             resolve(id);
    //         }
    //     });
    // }).then(function (id) {
    //     //console.log(id);
    //     var areaCurrent = 'Малиновський';
    //     Area.find({'subarea.name.last.ua':areaCurrent}).where('region').equals(id).exec(cb);
    //     function cb (err, area){
    //         if (err) console.log(err);
    //         if (area) console.log(area[0].name.last.ua);
    //         if (area) console.log(area[0].region);
    //         if (area) {
    //             area[0].subarea.forEach(function (item) {
    //                 if (item.name.last.ua == areaCurrent){
    //                     console.log(item.name.last.ua);
    //                     console.log(item._id)
    //                 }
    //             });
    //         }
    //     }
    // });
//-------------------------------------------------------------------------------------

    // Region.findOne({'name.last.ua':'Одеська'}, function (err, region) {
    //     if (err) console.log(err);
    //     var areaCurrent = 'Малиновський';
    //     if (region) {
    //         Area.find({'subarea.name.last.ua':areaCurrent}).where('region').equals(region._id).exec(cb);
    //
    //         function cb (err, area){
    //             if (err) console.log(err);
    //             if (area) console.log(area[0].name.last.ua);
    //             if (area) console.log(area[0].region);
    //             if (area) {
    //                 area[0].subarea.forEach(function (item) {
    //                     if (item.name.last.ua == areaCurrent){
    //                         console.log(item.name.last.ua);
    //                         console.log(item._id)
    //                     }
    //                 });
    //             }
    //         }
    //
    //     }
    // });

});



var findCourtById = async (function (id) {
    var result= await(Court.findOne({'area':id}, function (err, court) {

        if (err) console.log(err);
        if (court) {
            //console.log(court.name.last.ua);
            result = court.name.last.ua;
        }
    }));
    //console.log(result);
    return result;
});


function callback(err, court) {
    if (err) console.log(err);
    if (court) {
        court.forEach(function (item) {
           if (item.name.last){
               console.log(item.name.last.ua);
           }else {
               console.log(item);
           }
        });
    }
}

function callback2(err, area) {
    if (area){
        console.log(area);
    }
}

module.exports = router;