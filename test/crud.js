const mongoose = require("mongoose");
const Region = require('../models/region-new');

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app');
const should = chai.should();

chai.use(chaiHttp);

describe('Regions', function () {

    describe('get region', function () {
       var regForTesting = encodeURI('Вінницька');
       it('it should get Вінницька область ', function (done) {
           chai.request(server)
               .get('/get-region?name='+regForTesting)
               .end(function (err, res) {
                  res.should.have.status(200);
                  res.body.should.be.a('object');
                  res.body.should.have.property('name');
                   res.body.should.have.property('name').eql('Вінницька');
               done();
               });
       });
    });

    describe('number of regions', function () {

    });
});