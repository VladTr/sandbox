const mongoose = require('mongoose');
//Дочерняя схема
var nameSet = new mongoose.Schema({
    last:{
        ua:{type:String},
        ru:{type:String},
        en:{type:String}
    },
    old:{
        ua:{type:String}, //required:true
        ru:{type:String},
        en:{type:String}
    }
});

module.exports = nameSet;