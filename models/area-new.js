const options = require('../config');
const mongoose = require('mongoose');
var nameSet = require('./nameset');
var connection = mongoose.createConnection(options.mongoDatabase);
connection.on('error', function (err) {
    if (err)
        console.log('MongoDb connection error');
    connection.db.close();
    module.exports = false;
    return false;
});



//районы
var areaSchema = new mongoose.Schema({
    name:nameSet,
    region:{type:mongoose.Schema.Types.ObjectId, ref:'Region'},
    //region:{type:String},
    subarea:[
        {
            name:nameSet,
            streets:[
                {
                    name:nameSet,
                    regexp:String
                }
            ]
        }
    ],
    cities:[
        {
            name:nameSet
        }
    ]
});

areaSchema.statics.search = function (name, cb) {
    return this.findOne({'name.last.ua':name}).exec(cb);
};

areaSchema.methods.findSubArea = function findSubArea (street, callback) {
    return this.model('Area').find({'subarea.streets.name.last.ua':street}, callback);
};


module.exports = connection.model('Area', areaSchema);
//module.exports = mongoose.model('Users', UsersSchema);