const mongoose = require("mongoose");
const Region = require('../models/region-new');

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app');
const should = chai.should();

chai.use(chaiHttp);

describe('--Regions Areas Courts--', function () {

    describe('get region', function () {
       var regForTesting = encodeURI('Вінницька');
       it('it should get Вінницька область ', function (done) {
           chai.request(server)
               .get('/get-region?name='+regForTesting)
               .end(function (err, res) {
                  res.should.have.status(200);
                  res.body.should.be.a('object');
                  res.body.should.have.property('name');
               done();
               });
       });
    });

    describe('number of regions', function () {
        it('should get 25 pcs', function (done) {
            chai.request(server)
                .get('/count-regions')
                .end(function (err, res) {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('count');
                    res.body.should.have.property('count').eql(25);
                done();
                })
        });
    });

    describe('get area', function () {
        var areaForTesting = encodeURI('Лозівський');
        it('it should get Лозівський район ', function (done) {
            chai.request(server)
                .get('/get-area?name='+areaForTesting)
                .end(function (err, res) {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('name');
                    done();
                });
        });
    });

    describe('number of areas', function () {
        it('should get 568 pcs', function (done) {
            chai.request(server)
                .get('/count-areas')
                .end(function (err, res) {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('count');
                    res.body.should.have.property('count').eql(568);
                    done();
                })
        });
    });


    describe('get court', function () {
        var courtForTesting = encodeURI('Компаніївський районний суд Кіровоградської області');
        it('it should get Компаніївський районний суд Кіровоградської області ', function (done) {
            chai.request(server)
                .get('/get-court?name='+courtForTesting)
                .end(function (err, res) {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('name');
                    done();
                });
        });
    });

    describe('number of courts', function () {
        it('should get 615 pcs', function (done) {
            chai.request(server)
                .get('/count-courts')
                .end(function (err, res) {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('count');
                    res.body.should.have.property('count').eql(615);
                    done();
                })
        });
    });

    describe('find court', function () {
        var areaForTesting = encodeURI('Шацький');
        it('it should get Шацький районний суд Волинської області ', function (done) {
            chai.request(server)
                .get('/court-find?name='+areaForTesting)
                .end(function (err, res) {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('name');
                    done();
                });
        });
    });

    describe('number of streets ', function () {
        var areaForTesting = encodeURI('Київ');
        it('it should get Количество улиц Киева 2816 ', function (done) {
            chai.request(server)
                .get('/count-streets?name='+areaForTesting)
                .end(function (err, res) {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('count').eql(2816);
                    done();
                });
        });
    });

    describe('number of streets ', function () {
        var areaForTesting = encodeURI('Одеса');
        it('it should get Количество улиц Одесса 879', function (done) {
            chai.request(server)
                .get('/count-streets?name='+areaForTesting)
                .end(function (err, res) {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('count').eql(879);
                    done();
                });
        });
    });

    describe('number of streets ', function () {
        var areaForTesting = encodeURI('Донецьк');
        it('it should get Количество улиц Донецка 891', function (done) {
            chai.request(server)
                .get('/count-streets?name='+areaForTesting)
                .end(function (err, res) {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('count').eql(891);
                    done();
                });
        });
    });

    describe('number of streets ', function () {
        var areaForTesting = encodeURI('Львів');
        it('it should get Количество улиц Львів 1267', function (done) {
            chai.request(server)
                .get('/count-streets?name='+areaForTesting)
                .end(function (err, res) {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('count').eql(1267);
                    done();
                });
        });
    });

    describe('number of streets ', function () {
        var areaForTesting = encodeURI('Маріуполь');
        it('it should get Количество улиц Маріуполь 237', function (done) {
            chai.request(server)
                .get('/count-streets?name='+areaForTesting)
                .end(function (err, res) {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('count').eql(237);
                    done();
                });
        });
    });

    describe('number of streets ', function () {
        var areaForTesting = encodeURI('Запоріжжя');
        it('it should get Количество улиц Запоріжжя 1278', function (done) {
            chai.request(server)
                .get('/count-streets?name='+areaForTesting)
                .end(function (err, res) {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('count').eql(1278);
                    done();
                });
        });
    });

    describe('number of streets ', function () {
        var areaForTesting = encodeURI('Кропивницький');
        it('it should get Количество улиц Кропивницький 506', function (done) {
            chai.request(server)
                .get('/count-streets?name='+areaForTesting)
                .end(function (err, res) {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('count').eql(506);
                    done();
                });
        });
    });

    describe('number of streets ', function () {
        var areaForTesting = encodeURI('Миколаїв');
        it('it should get Количество улиц Миколаїв 1060', function (done) {
            chai.request(server)
                .get('/count-streets?name='+areaForTesting)
                .end(function (err, res) {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('count').eql(1060);
                    done();
                });
        });
    });

    describe('number of streets ', function () {
        var areaForTesting = encodeURI('Харків');
        it('it should get Количество улиц Харків 2565', function (done) {
            chai.request(server)
                .get('/count-streets?name='+areaForTesting)
                .end(function (err, res) {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('count').eql(2565);
                    done();
                });
        });
    });

    describe('number of sub areas ', function () {
        it('it should get 101', function (done) {
            chai.request(server)
                .get('/count-subareas')
                .end(function (err, res) {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('count').eql(101);
                    done();
                });
        });
    });

});