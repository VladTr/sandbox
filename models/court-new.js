const options = require('../config');
const mongoose = require('mongoose');
var nameset = require('./nameset');
var connection = mongoose.createConnection(options.mongoDatabase);
connection.on('error', function (err) {
    if (err)
        console.log('MongoDb connection error');
    connection.db.close();
    module.exports = false;
    return false;
});



var languageSet = new mongoose.Schema({
    ua:{type:String}, // required:true
    ru:{type:String},
    en:{type:String}
});



var courtSchema = new mongoose.Schema({
    name: nameset,
    area: {type:mongoose.Schema.Types.ObjectId, ref:'area'},
    region:{type:mongoose.Schema.Types.ObjectId, ref:'region'},
    spec: {type:Number},
    address: {type:String},
    phone:{type:String},
    email:{type:String},
    site:{type:String}
});



var Court = connection.model('Court', courtSchema);
module.exports = Court;