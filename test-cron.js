var schedule = require('node-schedule');


var j = schedule.scheduleJob('38 * * * *', function(){
    console.log('The answer to life, the universe, and everything!'+Date.now());
});