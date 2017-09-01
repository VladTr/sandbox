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


// var regionSchema = new mongoose.Schema({
//     name:nameSet
// });

//районы
var areaSchema = new mongoose.Schema({
    test:{type:String},
    name:nameSet,
    region:{type:mongoose.Schema.Types.ObjectId, ref:'Region'},
    //region:{type:String},
    subarea: {
            name:nameSet,
            streets:[
                {
                    name:nameSet,
                    regexp:String
                }
            ]
    },
    cities:[
        {
            name:nameSet
        }
    ]
});



module.exports = connection.model('Area', areaSchema);
//module.exports = mongoose.model('Users', UsersSchema);