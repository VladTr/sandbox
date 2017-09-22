const express = require('express');
const router = express.Router();
const request = require('request');
const cheerio = require('cheerio');
const func = require('../functions');
const fs = require('fs');
const path = require('path');

router.get('/donetsk', function (req, res) {
    var symbols = ['0', 'А', 'Б','В','Г','Д','Е','Є','Ж','З','І','К','Л','М','Н','О','П','Р','С','Т','У','Ф','Х','Ц','Ч','Ш','Щ','Ю','Я'];
    var subAreasName = [
        {name:'Пролетарський', streets:[]}, {name:'Кіровський', streets:[]}, {name:'Київський', streets:[]},
        {name:'Будьонівський', streets:[]}, {name:'Ворошиловський', streets:[]}, {name:'Калінінський', streets:[]},
        {name:'Куйбишевський', streets:[]}, {name:'Ленінський', streets:[]}, {name:'Петровський', streets:[]}];
    var baseUrl = 'https://uk.wikipedia.org/wiki/Список_вулиць_Донецька_(';
    //Big circle
    for (var k=0; k<symbols.length; k++){
        var symbol = symbols[k];
        var url = encodeURI(baseUrl+symbol+')');
            request.get(url,  function (error, response, body) {
                if (error) console.log(error);
                //if (response) console.log(response);
                if (body) {
                    var $ = cheerio.load(body);
                    var street, subarea, oldStreet = '';
                    var len = $('table.standard.sortable>tbody>tr').children().length;
                    for (var i=0; i<len-7; i++){
                        if (i%6 ==0){
                            street = $('table.standard.sortable>tbody>tr').children().eq(i+6).text();
                            oldStreet = $('table.standard.sortable>tbody>tr').children().eq(i+8).text();
                            subarea = $('table.standard.sortable>tbody>tr').children().eq(i+9).text();
                            subAreasName.forEach(function (el) {
                                if (el.name === subarea.trim() || subarea.indexOf(el.name)!==-1){
                                    el.streets.push({
                                        name:{
                                            last:{
                                                ua:street
                                            },
                                            old:{
                                                ua:oldStreet
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
    var log = '';
    for (var k=0; k<symbols.length; k++){
        var symbol = symbols[k];
        var url = encodeURI(baseUrl+symbol+')');
        request.get(url,  function (error, response, body) {
            if (error) console.log(error);
            //if (response) console.log(response);
            if (body) {
                //res.send(body);
                var $ = cheerio.load(body);

                var street, subarea, oldStreet = '';
                var len = $('table.wide.standard.sortable> tbody > tr').children().length;
                //console.log(len);
                for (var i=7; i<len-7; i++){
                    if (i%7 ==0){
                        street = ($('table.standard.sortable>tbody>tr').children().eq(i).text()).split('[')[0].trim();

                        oldStreet = ($('table.standard.sortable>tbody>tr').children().eq(i+2).text()).split('[')[0].trim();

                        subarea = $('table.standard.sortable>tbody>tr').children().eq(i+3).text();
                        if (street == 'Назва') break;


                        subAreasName.forEach(function (el) {
                            if (el.name === subarea.trim() || subarea.indexOf(el.name)!==-1){
                                //log+=street+' / '+subarea+'  old: '+oldStreet+'\n';
                                el.streets.push({
                                    name:{
                                        last:{
                                            ua:street
                                        },
                                        old:{
                                            ua:oldStreet
                                        }
                                    },
                                    regexp:'.*'
                                });
                            }
                        });

                    }

                }
            }
        });
    }
    // console.log(log);
    // fs.writeFile(path.join(__dirname,'../log/kiev.txt' ), log, function (err) {
    //     if (err) throw err;
    //     console.log('Replaced!');
    // });
   setTimeout(function(){ func.addSubareaWithStreets('Київська', 'Київ', subAreasName); }, 7000);


    res.end('kiev');
});

router.get('/odessa', function (req, res) {
    //var symbols = ['А', 'Б','В','Г','Ґ','Д','Е','Є','Ж','З','І','Ї','К','Л','М','Н','О','П','Р','С','Т','У','Ф',
    //    'Х','Ц','Ч','Ш','Щ','Ю','Я', 'Лінії', 'Садові'];
    var subAreasName = [
        {name:'Київський', streets:[]}, {name:'Малиновський', streets:[]}, {name:'Приморський', streets:[]},
        {name:'Суворовський', streets:[]}];
    var baseUrl = 'https://uk.wikipedia.org/wiki/Вулиці_Одеси';
    var url = encodeURI(baseUrl);
    request.get(url,  function (error, response, body) {
        if (error) console.log(error);
        //if (response) console.log(response);
        if (body) {
            var $ = cheerio.load(body);
            var street, subarea, oldSreet = '';
            for(var k=0; k<28; k++){
                var len = $('table.standard.sortable').eq(k).find('tr').children().length;
                console.log(len);
                for (var i=7; i<len; i++){
                    if(i%7 == 0){
                        street = $('table.standard.sortable').eq(k).find('tr').children().eq(i).text();
                        oldStreet = $('table.standard.sortable').eq(k).find('tr').children().eq(i+2).text();
                        subarea = $('table.standard.sortable').eq(k).find('tr').children().eq(i+3).text();
                        console.log('new: '+street+' old: '+oldStreet+'  /  '+subarea);
                        subAreasName.forEach(function (el) {
                            if (el.name === subarea.trim() || subarea.indexOf(el.name)!==-1) {
                                el.streets.push({
                                    name: {
                                        last: {
                                            ua: street
                                        },
                                        old: {
                                            ua: oldStreet
                                        }
                                    },
                                    regexp: '.*'
                                });
                            }
                        });
                    }
                }
            }

        }
    });

    setTimeout(function(){ func.addSubareaWithStreets('Одеська', 'Одеса', subAreasName); }, 4000);

    res.send('odessa');
});

router.get('/lviv', function (req, res) {
    var symbols = ['А', 'Б','В','Г','Ґ','Д','Е','Є','Ж','З','І','Й','К','Л','М','Н','О','П','Р','С','Т','У','Ф',
        'Х','Ц','Ч','Ш','Щ','Ю','Я'];
    var subAreasName = [
        {name:'Галицький', streets:[]}, {name:'Залізничний', streets:[]}, {name:'Личаківський', streets:[]},
        {name:'Сихівський', streets:[]}, {name:'Франківський', streets:[]}, {name:'Шевченківський', streets:[]}];
    var baseUrl = 'https://uk.wikipedia.org/wiki/Список_вулиць_Львова_(';
    //Big circle
    for (var k=0; k<symbols.length; k++){
        var symbol = symbols[k];
        var url = encodeURI(baseUrl+symbol+')');
        request.get(url,  function (error, response, body) {
            if (error) console.log(error);
            //if (response) console.log(response);
            if (body) {
                //res.send(body);
                var $ = cheerio.load(body);
                var street, subarea = '';
                var len = $('table.wide.standard.sortable> tbody > tr').children().length;
                //console.log(len);
                for (var i=7; i<len; i++){
                    if (i%7 ==0){
                        street = ($('table.standard.sortable>tbody>tr').children().eq(i).text()).split('[')[0].trim();

                        oldStreet = ($('table.standard.sortable>tbody>tr').children().eq(i+2).text()).split('[')[0].trim();

                        subarea = $('table.standard.sortable>tbody>tr').children().eq(i+3).text();
                        if (street == 'Назва') break;
                        console.log(street+' / '+subarea+'  old: '+oldStreet);
                        subAreasName.forEach(function (el) {
                            if (el.name === subarea.trim() || subarea.indexOf(el.name)!==-1){
                                el.streets.push({
                                    name:{
                                        last:{
                                            ua:street
                                        },
                                        old:{
                                            ua:oldStreet
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
   setTimeout(function(){ func.addSubareaWithStreets('Львівська', 'Львів', subAreasName); }, 7000);


    res.end();
});

router.get('/mariupol', function (req, res) {
    var subAreasName = [
        {name: 'Центральний', streets: []}, {name: 'Кальміуський', streets: []}, {name: 'Лівобережний', streets: []},
        {name: 'Приморський', streets: []}];
    var baseUrl = 'https://uk.wikipedia.org/wiki/Перелік_вулиць_і_площ_Маріуполя';
    //Big circle
    var url = encodeURI(baseUrl);
    request.get(url, function (error, response, body) {
        if (error) console.log(error);
        //if (response) console.log(response);
        if (body) {
            //res.send(body);
            var $ = cheerio.load(body);
            var street, subarea = '';
            var totalLen = $('div.mw-parser-output').find('span.mw-headline').length;
            for (var i = 0; i < totalLen - 4; i++) {
                subarea = $('div.mw-parser-output').find('span.mw-headline').eq(i).text();
                subarea = subarea.removeEntry('район').trim();
                var len = $('div.mw-parser-output').find('ul').eq(i + 2).find('a').length;
                for (var k = 0; k < len; k++) {
                    street = $('div.mw-parser-output').find('ul').eq(i + 2).find('a').eq(k).text();
                    street = street.removeEntry('Вулиця').trim();
                    street = street.removeEntry('Проспект').trim();
                    street = street.removeEntry('(Маріуполь)').trim();
                    street = street.removeEntry('Площа').trim();

                    if (street.length !== 0){
                        console.log(street + ' /  ' + subarea);
                        subAreasName.forEach(function (el) {
                            if (el.name === subarea.trim() || subarea.indexOf(el.name)!==-1) {
                                el.streets.push({
                                    name: {
                                        last: {
                                            ua: street
                                        },
                                        old: {
                                            ua: ''
                                        }
                                    },
                                    regexp: '.*'
                                });
                            }
                        });
                    }
                }
            }

    setTimeout(function(){ func.addSubareaWithStreets('Донецька', 'Маріуполь', subAreasName); }, 7000);

        }
    res.end();
    });
});

router.get('/zaporizhzhia', function (req, res) {
    var subAreasName = [
        {name: 'Олександрівський', streets: []}, {name: 'Заводський', streets: []}, {name: 'Комунарський', streets: []},
        {name: 'Дніпровський', streets: []}, {name: 'Вознесенівський', streets: []},{name: 'Хортицький', streets: []},
        {name:'Шевченківський', streets:[]}];
    var baseUrl = 'https://ru.wikipedia.org/wiki/Улицы_Запорожья';
    //Big circle
    var url = encodeURI(baseUrl);
    request.get(url, function (error, response, body) {
        if (error) console.log(error);
        if (body) {
            //res.send(body);
            var $ = cheerio.load(body);
            var street, subarea, oldStreet = '';

            var len = $('table.wikitable.sortable').eq(0).find('tr').children().length;
            for( var i=0; i<len; i++){
                if (i%4==0){
                    street = $('table.wikitable.sortable').eq(0).find('tr').children().eq(i+1).text();
                    street = street.removeEntry('вулиця').removeEntry('сквер').removeEntry('провулок').removeEntry('площа').trim();
                    subarea= $('table.wikitable.sortable').eq(0).find('tr').children().eq(i+2).text().removeEntry('район').trim();
                    oldStreet = $('table.wikitable.sortable').eq(0).find('tr').children().eq(i+3).text();
                    switch (subarea){
                        case 'Шевченковский':
                            subarea = 'Шевченківський';
                            break;
                        case 'Коммунарский':
                            subarea = 'Комунарський';
                            break;
                        case 'Александровский':
                            subarea = 'Олександрівський';
                            break;
                        case 'Днепровский':
                            subarea = 'Дніпровський';
                            break;
                        case 'Вознесеновский':
                            subarea = 'Вознесенівський';
                            break;
                        case 'Заводский':
                            subarea = 'Заводський';
                            break;
                        case 'Ленинский':
                            subarea = 'Дніпровський';
                            break;
                        case 'Хортицкий':
                            subarea = 'Хортицький';
                            break;
                        case 'Орджоникидзевский':
                            subarea = 'Вознесенівський';
                            break;
                        case 'Жовтневый':
                            subarea = 'Олександрівський';
                            break;
                    }
                    if (street.length!=0){
                        console.log(street + ' /  ' + subarea);
                        subAreasName.forEach(function (el) {
                            if (el.name === subarea.trim() || subarea.indexOf(el.name)!==-1) {
                                el.streets.push({
                                    name: {
                                        last: {
                                            ua: street
                                        },
                                        old: {
                                            ua: oldStreet
                                        }
                                    },
                                    regexp: '.*'
                                });
                            }
                        });
                    }
                }
            }
            setTimeout(function(){ func.addSubareaWithStreets('Запорізька', 'Запоріжжя', subAreasName); console.log(subAreasName); }, 7000);
        }
        res.end();
    });
});

router.get('/kropivnitsky', function (req, res) {
    var subAreasName = [
        {name: 'Фортечний', streets: []}, {name: 'Подільський', streets: []}];
    var baseUrl = 'https://uk.wikipedia.org/wiki/Вулиці_Кропивницького';
    var url = encodeURI(baseUrl);
    request.get(url, function (error, response, body) {
        if (error) console.log(error);
        if (body) {
            //res.send(body);
            var $ = cheerio.load(body);
            var street, subarea, oldStreet = '';

            var len = $('table.standard.sortable').eq(0).find('tr').children().length;
            console.log(len);
            for( var i=0; i<len; i++){
                if (i%7 == 0){
                    street = $('table.standard.sortable').eq(0).find('tr').children().eq(i).text();
                    oldStreet = $('table.standard.sortable').eq(0).find('tr').children().eq(i+2).text();
                    oldStreet = oldStreet.removeEntry('(част.)').removeEntry('(частина)').trim();
                    subarea= $('table.standard.sortable').eq(0).find('tr').children().eq(i+3).text();

                    if(subarea.length !=0){
                        console.log(street + ' /  ' + subarea+'     old =>'+oldStreet);
                        subAreasName.forEach(function (el) {
                            if (el.name === subarea.trim() || subarea.indexOf(el.name)!==-1) {
                                el.streets.push({
                                    name: {
                                        last: {
                                            ua: street
                                        },
                                        old: {
                                            ua: oldStreet
                                        }
                                    },
                                    regexp: '.*'
                                });
                            }
                        });

                    }


                }
            }

            setTimeout(function(){ func.addSubareaWithStreets('Кіровоградська', 'Кропивницький', subAreasName); }, 7000);
        }
        res.end();
    });
});

router.get('/mycolaiv', function (req, res) {
    var subAreasName = [
        {name: 'Заводський', streets: []}, {name: 'Корабельний', streets: []},
        {name: 'Центральний', streets: []}, {name: 'Інгульський', streets: []}
    ];
    var baseUrl = 'https://uk.wikipedia.org/wiki/Вулиці_Миколаєва';
    var url = encodeURI(baseUrl);
    request.get(url, function (error, response, body) {
        if (error) console.log(error);
        if (body) {
            //res.send(body);
            var $ = cheerio.load(body);
            var street, subarea, oldStreet = '';
            var totalLen = $('table').length;
            for (var k=1; k<totalLen-3; k++){
                var len = $('table').eq(k).find('tr').length;
                for( var i=0; i<len; i++){
                    street = $('table').eq(k).find('tr').eq(i).children().eq(1).text().removeEntry('вулиця')
                        .removeEntry('провулок').removeEntry('площа').trim();
                    oldStreet = $('table').eq(k).find('tr').eq(i).children().eq(5).text();
                    subarea= $('table').eq(k).find('tr').eq(i).children().eq(2).text();

                    if(subarea.length !=0){
                        console.log(street + ' /  ' + subarea+'     old =>'+oldStreet);
                        subAreasName.forEach(function (el) {
                            if (el.name === subarea.trim() || subarea.indexOf(el.name)!==-1) {
                                el.streets.push({
                                    name: {
                                        last: {
                                            ua: street
                                        },
                                        old: {
                                            ua: oldStreet
                                        }
                                    },
                                    regexp: '.*'
                                });
                            }
                        });

                    }
                }
            }
            setTimeout(function(){ func.addSubareaWithStreets('Миколаївська', 'Миколаїв', subAreasName); }, 7000);
        }
        res.end();
    });
});

router.get('/kharkiv', function (req, res) {
    var symbols = ['А', 'Б','В','Г','Д','Е','Є','Ж','З','І','К','Л','М','Н','О','П','Р','С','Т','У','Ф',
        'Х','Ц','Ч','Ш','Щ','Ю','Я'];
    var subAreasName = [
        {name:'Шевченківський', streets:[]}, {name:'Новобаварський', streets:[]}, {name:'Київський', streets:[]},
        {name:'Слобідський', streets:[]}, {name:'Холодногірський', streets:[]}, {name:'Московський', streets:[]},
        {name:'Індустріальний', streets:[]}, {name:'Немишлянський', streets:[]}, {name:"Основ'янський", streets:[]}];
    var baseUrl = 'https://uk.wikipedia.org/wiki/Список_вулиць_Харкова_(';

    //Big circle
    for (var k=1; k<symbols.length; k++){
        var symbol = symbols[k];
        var url = encodeURI(baseUrl+symbol+')');
        request.get(url,  function (error, response, body) {
            if (error) console.log(error);
            //if (response) console.log(response);
            if (body) {
                // res.send(body);
                var $ = cheerio.load(body);
                var street, subarea, oldStreet = '';
                var len = $('table.standard.sortable> tbody > tr').children().length;
                for (var i=6; i<len-7; i++){
                    if (i%6 ==0){
                        street = $('table.standard.sortable>tbody>tr').children().eq(i).text();
                        oldStreet = $('table.standard.sortable>tbody>tr').children().eq(i+3).text();
                        subarea = $('table.standard.sortable>tbody>tr').children().eq(i+4).text();
                        switch (subarea){
                            case 'Жовтневий':
                                subarea = 'Новобаварський';
                                break;
                            case 'Фрунзенський':
                                subarea = 'Немишлянський';
                                break;
                            case 'Комінтернівський':
                                subarea = 'Слобідський';
                                break;
                            case 'Червонозаводський':
                                subarea = "Основ'янський";
                                break;
                        }
                        //console.log(street+' / '+subarea+'  old: '+oldStreet);
                        subAreasName.forEach(function (el) {
                            if (el.name === subarea.trim() || subarea.indexOf(el.name)!==-1){
                                el.streets.push({
                                    name:{
                                        last:{
                                            ua:street
                                        },
                                        old:{
                                            ua:oldStreet
                                        }
                                    },
                                    regexp:'.*'
                                });
                            }
                        });
                    }
                }



            }
        });
    }
    setTimeout(function(){ func.addSubareaWithStreets('Харківська', 'Харків', subAreasName); }, 9000);


    res.end();
});

router.get('/all-other', function (req, res) {

    var subAreasNameKamyanske = [
        {name:'Південний', streets:[]}, {name:'Дніпровський', streets:[]}, {name:'Заводський', streets:[]}];

    var subAreasNameDnipro = [
        {name:'Амур-Нижньодніпровський', streets:[]},{name:'Шевченківський', streets:[]},{name:'Соборний', streets:[]},
        {name:'Індустріальний', streets:[]}, {name:'Центральний', streets:[]}, {name:'Чечелівський', streets:[]},
        {name:'Новокодацький', streets:[]},{name:'Самарський', streets:[]}
    ];

    var subAreasNameKryvyiRig = [
        {name:'Металургійний', streets:[]},{name:'Довгинцівський', streets:[]},{name:'Покровський', streets:[]},
        {name:'Інгулецький', streets:[]},{name:'Саксаганський', streets:[]},{name:'Тернівський', streets:[]},
        {name:'Центрально-Міський', streets:[]}
    ];

    var subAreasNameGorlivka = [
        {name:'Калинінський', streets:[]},{name:'Микитівський', streets:[]},{name:'Центрально-Міський', streets:[]}];

    var subAreasNameMakiivka = [
        {name:'Гірницький', streets:[]},{name:'Кіровський', streets:[]},{name:'Совєтський', streets:[]},
        {name:'Центрально-Міський', streets:[]},{name:'Червоногвардійський', streets:[]}
    ];

    var subAreasNameZhitomir = [
        {name:'Богунський', streets:[]},{name:'Корольовський', streets:[]}];

    var subAreasNameLugansk = [
        {name:'Артемівський', streets:[]},{name:'Жовтневий', streets:[]},{name:"Кам'янобрідський", streets:[]},
        {name:'Ленінський', streets:[]}];

    var subAreasNameKremenchuk = [
        {name:'Автозаводський', streets:[]},{name:'Крюківський', streets:[]}];

    var subAreasNamePoltava = [
        {name:'Київський', streets:[]}, {name:'Подільський', streets:[]}, {name:'Шевченківський', streets:[]}];

    var subAreasNameSumy = [
        {name:'Зарічний', streets:[]},{name:'Ковпаківський', streets:[]}];

    // var subAreasNameKherson = [
    //     {name:'Дніпровський', streets:[]},{name:'Корабельний', streets:[]},{name:'Суворівський', streets:[]}];

    var subAreasNameCherkassy = [
        {name:'Придніпровський', streets:[]},{name:'Соснівський', streets:[]}];

    var subAreasNameChernivtsy = [
        {name:'Першотравневий', streets:[]},{name:'Садгірський', streets:[]},{name:'Шевченківський', streets:[]}];

    var subAreasNameChernigov = [
        {name:'Деснянський', streets:[]},{name:'Новозаводський', streets:[]}];

    setTimeout(function(){ func.addSubareaWithStreets('Дніпропетровська', "Кам'янське", subAreasNameKamyanske); }, 2000);
    setTimeout(function(){ func.addSubareaWithStreets('Дніпропетровська', "Дніпро", subAreasNameDnipro); }, 2000);
    setTimeout(function(){ func.addSubareaWithStreets('Дніпропетровська', "Кривий Ріг", subAreasNameKryvyiRig); }, 2000);
    setTimeout(function(){ func.addSubareaWithStreets('Донецька', "Горлівка", subAreasNameGorlivka); }, 2000);
    setTimeout(function(){ func.addSubareaWithStreets('Донецька', "Макіївка", subAreasNameMakiivka); }, 2000);
    setTimeout(function(){ func.addSubareaWithStreets('Житомирська', "Житомир", subAreasNameZhitomir); }, 2000);
    setTimeout(function(){ func.addSubareaWithStreets('Луганська', "Луганськ", subAreasNameLugansk); }, 2000);
    setTimeout(function(){ func.addSubareaWithStreets('Полтавська', "Кременчук", subAreasNameKremenchuk); }, 2000);
    setTimeout(function(){ func.addSubareaWithStreets('Полтавська', "Полтава", subAreasNamePoltava); }, 2000);
    setTimeout(function(){ func.addSubareaWithStreets('Сумська', "Суми", subAreasNameSumy); }, 2000);
    // setTimeout(function(){ func.addSubareaWithStreets('Херсонська', "Херсон", subAreasNameKherson); }, 2000);
    setTimeout(function(){ func.addSubareaWithStreets('Черкаська', "Черкаси", subAreasNameCherkassy); }, 2000);
    setTimeout(function(){ func.addSubareaWithStreets('Чернівецька', "Чернівці", subAreasNameChernivtsy); }, 2000);
    setTimeout(function(){ func.addSubareaWithStreets('Чернігівська', "Чернігів", subAreasNameChernigov); }, 2000);
    res.end();
});

String.prototype.removeEntry = function (entry) {
    if(this.indexOf(entry)!=-1){
        var before = this.substring(0, this.indexOf(entry));
        var after = this.substring(this.indexOf(entry)+entry.length);
        return before+after;
    } else {
        return this;
    }
};



module.exports = router;