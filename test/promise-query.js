// const Queue = require('promise-queue');
// var maxConcurrent = 1;
// var maxQueue = Infinity;
// var queue = new Queue(maxConcurrent, maxQueue);
//
// function getResult(index) {
//   return new Promise(function (resolve, reject) {
//      setTimeout(function () {
//          console.log('f#:'+index);
//          resolve();
//      }, 5000)
//   });
// };

// function getResult(index) {
//         setTimeout(function () {
//             console.log('f#:'+index);
//         }, 2000)
// }


// for (let i=1; i<5; i++) {
//    queue.add( function () {
//        getResult(i).then(function () {
//            console.log('done');
//        })})
//        .then(function () {
//            // console.log('done by dfd');
//        })
//        .catch(function () {});
// }


var Queue = require('simple-promise-queue');

Queue.setPromise(require('bluebird'));

var queue = new Queue({
    autoStart: true, // autostart the queue
    concurrency: 1
});

var promiseArr = [];


function getCourt(id) {
    return function (resolve, reject) {
        "use strict";
        setTimeout(function () {
            console.log('task '+id+' done');
            if (id===8){
                console.log('8--->');
                reject(id);
            } else {
                resolve();
            }
        }, 1000);
    }
}


var getInfo = function(id) {
    var promise = queue.pushTask(getCourt(id));
    promiseArr.push(promise);
};

for (var id = 0; id < 9; id++) {
    getInfo(id);
}

console.time('check');

Promise.all(promiseArr)
    .then(function() {
            console.log('done all');
            console.timeEnd('check');
        },
        function () {
            console.log('error'+id);
        }
    );

















