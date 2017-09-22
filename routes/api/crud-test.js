const Region = require('../../models/region-new');
const Area = require('../../models/area-new');
const Court = require('../../models/court-new');

var crud = {
  getRegion: function (req, res) {
      Region.findOne({'name.last.ua':req.query.name}, function (err, region) {
         if (err) res.send(err);
         res.json(region);
      });
  },
  regionsCount: function (req, res) {
        Region.count({}, function (err, count) {
            if (err) res.send(err);
            res.json({count:count});
        });
  },
  getArea: function (req, res) {
      Area.findOne({'name.last.ua':req.query.name}, function (err, area) {
          if (err) res.send(err);
          res.json(area);
      });
  },
  areasCount: function (req, res) {
      Area.count({}, function (err, count) {
          if (err) res.send(err);
          res.json({count:count});
      });
  },
  getCourt: function (req, res) {
      Court.findOne({'name.last.ua':req.query.name}, function (err, court) {
          if (err) res.send(err);
          res.json(court);
      });
  },
  courtsCount: function (req, res) {
      Court.count({}, function (err, count) {
          if (err) res.send(err);
          res.json({count:count});
      });
  },
  courtFind: function (req, res) {
      Court.findOne({'name.last.ua':'Шацький районний суд Волинської області'}).populate('area')
          .exec( function (err, court) {
                    if (err) res.send(err);
                    if (court.area.name.last.ua === req.query.name){
                        res.json({name:court.name.last.ua})
                    } else {
                        res.sendStatus(503);
                    }

          });
  },

  countStreets: function (req, res) {
       Area.findOne({'name.last.ua':req.query.name}, function (err, area) {
          if (err) console.log(err);
          if (area) {
              var count = 0;
              area.subarea.forEach(function (sub) {
                  sub.streets.forEach(function (street) {
                      count++;
                  })
              });
              res.json({count:count});
          }
       });
  },

    countSubareas: function (req, res) {
        Area.find({}, function (err, areas) {
            if (err) console.log(err);
            var count =0;
            areas.forEach(function (area) {
                if (area.subarea.length > 0) {
                    //console.log(area.name.last.ua+'number of subs: '+ area.subarea.length);
                    count+=area.subarea.length;
                }
            });
            res.json({count:count});
        });
    }

};

module.exports = crud;