const express = require('express');
const router = express.Router();
const Area = require('../../models/area-new');
const Region = require('../../models/region-new');

router.get('/', function (req, res) {
    res.send('subarea');

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


    var promise = new Promise (function (resolve, reject) {
        Region.findOne({'name.last.ua':'Одеська'}, function (err, region){
            if (region) {
                var id = region._id;
                resolve(id);
            }
        });
    }).then(function (id) {
        //console.log(id);
        var areaCurrent = 'Малиновський';
        Area.find({'subarea.name.last.ua':areaCurrent}).where('region').equals(id).exec(cb);
        function cb (err, area){
            if (err) console.log(err);
            if (area) console.log(area[0].name.last.ua);
            if (area) console.log(area[0].region);
            if (area) {
                area[0].subarea.forEach(function (item) {
                    if (item.name.last.ua == areaCurrent){
                        console.log(item.name.last.ua);
                        console.log(item._id)
                    }
                });
            }
        }
    });


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