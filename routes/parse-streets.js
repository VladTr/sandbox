const express = require('express');
const router = express.Router();
const request = require('request');
const cheerio = require('cheerio');
const func = require('../functions');

router.get('/donetsk', function (req, res) {
    var symbols = ['0', 'А', 'Б','В','Г','Д','Е','Є','Ж','З','І','К','Л','М','Н','О','П','Р','С','Т','У','Ф','Х','Ц','Ч','Ш','Щ','Ю','Я'];
    var subAreasName = [
        {name:'Пролетарський', streets:[]}, {name:'Кіровський', streets:[]}, {name:'Київський', streets:[]},
        {name:'Будьонівський', streets:[]}, {name:'Ворошиловський', streets:[]}, {name:'Калінінський', streets:[]},
        {name:'Куйбишевський', streets:[]}, {name:'Ленінський', streets:[]}, {name:'Пролетарський', streets:[]}];
    var baseUrl = 'https://uk.wikipedia.org/wiki/Список_вулиць_Донецька_(';
    //Big circle
    for (var k=0; k<symbols.length; k++){
        var symbol = symbols[k];
        var url = encodeURI(baseUrl+symbol+')');
            var that = this;
            request.get(url,  function (error, response, body) {
                if (error) console.log(error);
                //if (response) console.log(response);
                if (body) {
                    var $ = cheerio.load(body);
                    var street, subarea = '';
                    var len = $('table.standard.sortable>tbody>tr').children().length;
                    for (var i=0; i<len-7; i++){
                        if (i%6 ==0){
                            street = $('table.standard.sortable>tbody>tr').children().eq(i+6).text();
                            subarea = $('table.standard.sortable>tbody>tr').children().eq(i+9).text();
                            subAreasName.forEach(function (el) {
                                if (el.name === subarea.trim()){
                                    el.streets.push({
                                        name:{
                                            last:{
                                                ua:street
                                            }
                                        },
                                        regexp:'.*'
                                    });
                                }
                            });
                        }

                    }
                    //var street = $('table.standard.sortable>tbody>tr>td').children().eq(0).text();
                    //var street = $('table.standart tbody tr td').eq(0).children().eq(0).text();
                    // if (k==symbols.length-1){
                    //     console.dir(subAreasName);
                    // }
                }
            });
    }
    setTimeout(function(){ func.addSubareaWithStreets('Донецька', 'Донецьк', subAreasName); }, 4000);


    res.end();
});

router.get('/kyiv', function (req, res) {
    var symbols = ['А', 'Б','В','Г','Ґ','Д','Е','Є','Ж','З','І','Ї','К','Л','М','Н','О','П','Р','С','Т','У','Ф',
        'Х','Ц','Ч','Ш','Щ','Ю','Я', 'Лінії', 'Садові'];
    var subAreasName = [
        {name:'Голосіївський', streets:[]}, {name:'Дарницький', streets:[]}, {name:'Деснянський', streets:[]},
        {name:'Дніпровський', streets:[]}, {name:'Оболонський', streets:[]}, {name:'Печерський', streets:[]},
        {name:'Подільський', streets:[]}, {name:'Святошинський', streets:[]}, {name:"Солом'янський", streets:[]},
        {name:'Шевченківський', streets:[]}];
    var baseUrl = 'https://uk.wikipedia.org/wiki/Список_вулиць_Києва_(';
    //Big circle
    for (var k=0; k<1/*symbols.length*/; k++){
        var symbol = symbols[k];
        var url = encodeURI(baseUrl+symbol+')');
        request.get(url,  function (error, response, body) {
            if (error) console.log(error);
            //if (response) console.log(response);
            if (body) {
                res.send(body);
                var $ = cheerio.load(body);
                var street, subarea = '';
                var len = $('table.wide.standard.sortable> tbody > tr').children().length;
                //console.log(len);
                for (var i=7; i<len-7; i++){
                    if (i%7 ==0){
                        street = ($('table.standard.sortable>tbody>tr').children().eq(i).text()).split('[')[0].trim();

                        oldStreet = ($('table.standard.sortable>tbody>tr').children().eq(i+2).text()).split('[')[0].trim();

                        subarea = $('table.standard.sortable>tbody>tr').children().eq(i+3).text();
                        if (street == 'Назва') break;
                        console.log(street+' / '+subarea+'  old: '+oldStreet);
                        subAreasName.forEach(function (el) {
                            if (el.name === subarea.trim()){
                                el.streets.push({
                                    name:{
                                        last:{
                                            ua:street
                                        }
                                    },
                                    regexp:'.*'
                                });
                            }
                        });
                    }

                }
                //var street = $('table.standard.sortable>tbody>tr>td').children().eq(0).text();
                //var street = $('table.standart tbody tr td').eq(0).children().eq(0).text();
                // if (k==symbols.length-1){
                //     console.dir(subAreasName);
                // }
            }
        });
    }
   // setTimeout(function(){ func.addSubareaWithStreets('Донецька', 'Донецьк', subAreasName); }, 4000);


    //res.end();
});

module.exports = router;