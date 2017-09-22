const express = require('express');
const router = express.Router();
const Court = require('../../models/court-new');
const url = require('url');

router.get('/', function (req, res) {

    // var courtOldName = 'Поліський районний суд Київської області (скасований)';
    // var courtNewName = 'Іванківський районний суд Київської області';
    let courtOldName = url.parse(req.url, true).query['old'];
    let courtNewName = url.parse(req.url, true).query['new'];
    if (courtOldName && courtNewName) {
        var promise = new Promise(function (resolve, reject) {
            Court.findOne({'name.last.ua': courtNewName}, function (err, courtNew) {
                if (err) console.log(err);
                if (courtNew === null) {
                    reject(new Error('error with court'));
                } else {
                    Court.findOne({'name.last.ua':courtOldName}, function (err, courtOld) {
                        if (err) console.log(err);
                        if (courtOld === null){
                            reject(new Error('error with court'));
                        } else {
                            resolve('result');
                        }
                    })
                }

            })
        });
        promise.then(function (result) {
            res.sendStatus(200);
        });
        promise.catch(
            function (error) {
                console.log('error: '+error);
                res.sendStatus(503);
            }
        );
    }
});

module.exports = router;