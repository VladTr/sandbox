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


var regionSchema = new mongoose.Schema({
    name:nameSet
});

regionSchema.statics.getAllRegions = function getAllRegions(callback) {
    return this.find({}).exec(callback);
};


var Region = connection.model('Region', regionSchema);
module.exports = Region;