const options = require('../config');
const mongoose = require('mongoose');
var connection = mongoose.createConnection(options.mongoDatabase);
connection.on('error', function (err) {
    if (err)
        console.log('MongoDb connection error');
    connection.db.close();
    module.exports = false;
    return false;
});

var nameChildrenSchema = new mongoose.Schema({
    oldName: {type: String},
    newName: {type: String}
});
var areaChildrenSchema = new mongoose.Schema({
    oldName: {type: String},
    newName: {type: String}
});


var courtSchema = new mongoose.Schema({
    name: nameChildrenSchema,
    area: areaChildrenSchema,
    region: {type:String},
    type: {type:Number},
    address: {type: String, default:''},
    phone: {type: String, default:''},
    email: {type: String, default:''}
});

var Court = connection.model('Court', courtSchema);
module.exports = Court;