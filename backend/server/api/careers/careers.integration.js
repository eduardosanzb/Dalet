'use strict';

var app = require('../..');
import request from 'supertest';

var newCareers;

describe('Careers API:', function() {
  describe('GET /api/careers', function() {
    var careerss;

    beforeEach(function(done) {
      request(app)
        .get('/api/careers')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          careerss = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      expect(careerss).to.be.instanceOf(Array);
    });
  });

  describe('POST /api/careers', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/careers')
        .send({
          name: 'New Careers',
          info: 'This is the brand new careers!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          newCareers = res.body;
          done();
        });
    });

    it('should respond with the newly created careers', function() {
      expect(newCareers.name).to.equal('New Careers');
      expect(newCareers.info).to.equal('This is the brand new careers!!!');
    });
  });

  describe('GET /api/careers/:id', function() {
    var careers;

    beforeEach(function(done) {
      request(app)
        .get(`/api/careers/${newCareers._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          careers = res.body;
          done();
        });
    });

    afterEach(function() {
      careers = {};
    });

    it('should respond with the requested careers', function() {
      expect(careers.name).to.equal('New Careers');
      expect(careers.info).to.equal('This is the brand new careers!!!');
    });
  });

  describe('PUT /api/careers/:id', function() {
    var updatedCareers;

    beforeEach(function(done) {
      request(app)
        .put(`/api/careers/${newCareers._id}`)
        .send({
          name: 'Updated Careers',
          info: 'This is the updated careers!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          updatedCareers = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedCareers = {};
    });

    it('should respond with the original careers', function() {
      expect(updatedCareers.name).to.equal('New Careers');
      expect(updatedCareers.info).to.equal('This is the brand new careers!!!');
    });

    it('should respond with the updated careers on a subsequent GET', function(done) {
      request(app)
        .get(`/api/careers/${newCareers._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          let careers = res.body;

          expect(careers.name).to.equal('Updated Careers');
          expect(careers.info).to.equal('This is the updated careers!!!');

          done();
        });
    });
  });

  describe('PATCH /api/careers/:id', function() {
    var patchedCareers;

    beforeEach(function(done) {
      request(app)
        .patch(`/api/careers/${newCareers._id}`)
        .send([
          { op: 'replace', path: '/name', value: 'Patched Careers' },
          { op: 'replace', path: '/info', value: 'This is the patched careers!!!' }
        ])
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          patchedCareers = res.body;
          done();
        });
    });

    afterEach(function() {
      patchedCareers = {};
    });

    it('should respond with the patched careers', function() {
      expect(patchedCareers.name).to.equal('Patched Careers');
      expect(patchedCareers.info).to.equal('This is the patched careers!!!');
    });
  });

  describe('DELETE /api/careers/:id', function() {
    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete(`/api/careers/${newCareers._id}`)
        .expect(204)
        .end(err => {
          if(err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when careers does not exist', function(done) {
      request(app)
        .delete(`/api/careers/${newCareers._id}`)
        .expect(404)
        .end(err => {
          if(err) {
            return done(err);
          }
          done();
        });
    });
  });
});
