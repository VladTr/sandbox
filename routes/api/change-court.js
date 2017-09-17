var express = require('express');
var router = express.Router();
const Court = require('../../models/court-new');

router.get('/', function (req, res) {

    var courtOldName = 'Поліський районний суд Київської області (скасований)';
    var courtNewName = 'Іванківський районний суд Київської області';

    var promise = new Promise(function (resolve, reject) {
       Court.findOne({'name.last.ua':courtNewName}, function (err, courtNew) {
           if (err) console.log(err);
           resolve(courtNew);
       }).then(function (courtNew) {
          Court.findOne({'name.last.ua':courtOldName}, function (err, courtOld) {
           if (err) console.log(err);
              courtOld.replace = courtNew._id;
              courtOld.save(function (error) {
                  if (err) console.log(error);
              });
          });
       });
    });


    res.send('change-court');

});

module.exports = router;

