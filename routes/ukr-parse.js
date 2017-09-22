const express = require('express');
const router = express.Router();
const fs = require('fs');
var csvjson = require('csvjson');
var path = require('path');
var iconvlite = require('iconv-lite');
var func = require('../functions');
var currentRegion = require('../data/regions-all');

//временно
var Area = require('../models/area-new');

router.get('/', function (req, res) {

    /*Drop collection*/
    // Area.remove({}, function(err) {
    //     console.log('collection removed')
    // });

    /*Great circle*/
    for (var index=0; index<currentRegion.length; index++){
        if (currentRegion[index].file !==''){
            console.log(currentRegion[index].name);
            var data = fs.readFileSync(path.join(__dirname, '../data/'+currentRegion[index].file), { encoding : 'utf8'});
            var areaInfo = {
                name:'',
                list:[]
            };
            var options = {
                delimiter : ',',
                quote     : '"'
            };
            var flag = false; //маркер первого вхождения
            var obj =csvjson.toArray(data, options);
            //вспомогательный цикл
            var len, add, tmp =[];
            for (var j=0; j<obj.length; j++){
                var resultToRemove = obj[j].toString();
                if (resultToRemove.indexOf('рада')!==-1){
                    obj.splice(j,1);
                }
                if (resultToRemove.indexOf('"')!==-1){
                    obj.splice(j,1);
                }
                if (resultToRemove.indexOf('громада')!==-1){
                    obj.splice(j,1);
                }
                if (resultToRemove.indexOf('громади')!==-1){
                    obj.splice(j,1);
                }
                if (resultToRemove.indexOf('район')!==-1){
                    len = resultToRemove.split(' ').length;
                    add = resultToRemove.split(' ')[len-1];
                    add = add.substring(0, add.length-1);
                    if (add!=='райо'){
                        add = '99 c '+add;
                        tmp.push(add);
                        obj.splice(j+1, 0, tmp);
                        tmp=[];

                    }
                }
                //console.log(obj);
            }

            for (var i=0; i<obj.length; i++){
                var result = obj[i].toString();
                if (result.indexOf('район') !==-1 && flag && i!==0){

                    //console.log(currentRegion[index].name);

                    func.realAdd(areaInfo.name, areaInfo.list, currentRegion[index].name);
                    areaInfo.list = [];
                }
                if (result.indexOf('район') !==-1) {
                    areaInfo.name = result.split(" ")[0];
                    flag = true;
                }
                if (flag && result.split(" ")[2] !=='' && result.split(" ")[2] != null){
                    if (result.split(" ")[4] != undefined){
                        console.log('i found it => '+result);
                        areaInfo.list.push(result.split(" ")[2]+' '+result.split(" ")[3]+' '+result.split(" ")[4]);
                    } else if (result.split(" ")[3] != undefined){
                        areaInfo.list.push(result.split(" ")[2]+' '+result.split(" ")[3]);
                    } else {
                        areaInfo.list.push(result.split(" ")[2]);
                    }
                }
            }
        }
    }



/*

    var data = fs.readFileSync(path.join(__dirname, '../data/vinnitsa.csv'), { encoding : 'utf8'});
    // var data = readFileSync_encoding(path.join(__dirname,'../regions/houses.csv'), 'win1251');
    var mainArray = [];
    var areaInfo = {
        name:'',
        list:[]
    };
    var options = {
        delimiter : ',',
        quote     : '"'
    };
    var flag = false; //маркер первого вхождения
    //var obj = csvjson.toObject(data, options);
    var obj =csvjson.toArray(data, options);

    //вспомогательный цикл
    console.log(obj.length);
    for (var j=0; j<obj.length; j++){
        var resultToRemove = obj[j].toString();
        if (resultToRemove.indexOf('рада')!==-1){
            obj.splice(j,1);
        }
        if (resultToRemove.indexOf('"')!==-1){
            obj.splice(j,1);
        }
        if (resultToRemove.indexOf('громада')!==-1){
            obj.splice(j,1);
        }
        if (resultToRemove.indexOf('громади')!==-1){
            obj.splice(j,1);
        }
    }
    // смотрим что вышло
    console.log(obj.length);
    for (var k=0; k<obj.length; k++){
        //console.log(obj[k]);
    }


    var arr = String(obj[9]).split(" ");

    for (var i=0; i<obj.length; i++){

        var result = obj[i].toString();

        if (result.indexOf('район') !==-1 && flag && i!==0){
            //console.log('-------'+areaInfo.name);
            //console.log('_____'+areaInfo.list);
            // !!!!!!!!!!!!!!!!!!!!!
            //func.singleAdd(areaInfo.name, areaInfo.list);
            func.realAdd(areaInfo.name, areaInfo.list);
            // if (i < 160){
            //     console.log(i);
            //     func.realAdd(areaInfo.name, areaInfo.list);
            // }



            areaInfo.list = [];
        }
        if (result.indexOf('район') !==-1) {
            areaInfo.name = result.split(" ")[0];
            flag = true;
        }
        if (flag && result.split(" ")[2] !=='' && result.split(" ")[2] != null){
            if (result.split(" ")[3] != undefined){
                areaInfo.list.push(result.split(" ")[2]+' '+result.split(" ")[3]);
            } else {
                areaInfo.list.push(result.split(" ")[2]);
            }
            if (result.split(" ")[4] != undefined){
                console.log('i found it =>  '+result);
            }
        }

    }
*/
    res.send('ukr-parse');
});

function readFileSync_encoding(filename, encoding) {
    var content = fs.readFileSync(filename);
    return iconvlite.decode(content, encoding);
}


module.exports = router;