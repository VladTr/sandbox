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


var courtSchema = new mongoose.Schema({
    name: nameset,
    area: {type:mongoose.Schema.Types.ObjectId, ref:'Area'},
    region:{type:mongoose.Schema.Types.ObjectId, ref:'Region'},
    spec: {type:Number},
    address: {type:String},
    phone:{type:String},
    email:{type:String},
    site:{type:String}
});


var Court = connection.model('Court', courtSchema);
module.exports = Court;