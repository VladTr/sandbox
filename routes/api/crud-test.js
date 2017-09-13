const Region = require('../../models/region-new');

var crud = {
  getRegion: function (req, res) {
      Region.findOne({'name.last.ua':req.query.name}, function (err, region) {
         if (err) res.send(err);
         //console.log(region);
         res.json(region);
      });
  },
  regionsCount: function (req, res) {
        Region.count({}, function (err, count) {
            if (err) res.send(err);
            res.json(count);
        });
  }

};

module.exports = crud;