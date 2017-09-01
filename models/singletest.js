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


var singleSchema = new mongoose.Schema({
    name: String,
    list: Array
});

var Single = connection.model('Single', singleSchema);
module.exports = Single;