'use strict';

var app = require('../..');
import request from 'supertest';

var newFacebook;

describe('Facebook API:', function() {
  describe('GET /api/facebook', function() {
    var facebooks;

    beforeEach(function(done) {
      request(app)
        .get('/api/facebook')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          facebooks = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      expect(facebooks).to.be.instanceOf(Array);
    });
  });

  describe('POST /api/facebook', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/facebook')
        .send({
          name: 'New Facebook',
          info: 'This is the brand new facebook!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          newFacebook = res.body;
          done();
        });
    });

    it('should respond with the newly created facebook', function() {
      expect(newFacebook.name).to.equal('New Facebook');
      expect(newFacebook.info).to.equal('This is the brand new facebook!!!');
    });
  });

  describe('GET /api/facebook/:id', function() {
    var facebook;

    beforeEach(function(done) {
      request(app)
        .get(`/api/facebook/${newFacebook._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          facebook = res.body;
          done();
        });
    });

    afterEach(function() {
      facebook = {};
    });

    it('should respond with the requested facebook', function() {
      expect(facebook.name).to.equal('New Facebook');
      expect(facebook.info).to.equal('This is the brand new facebook!!!');
    });
  });

  describe('PUT /api/facebook/:id', function() {
    var updatedFacebook;

    beforeEach(function(done) {
      request(app)
        .put(`/api/facebook/${newFacebook._id}`)
        .send({
          name: 'Updated Facebook',
          info: 'This is the updated facebook!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          updatedFacebook = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedFacebook = {};
    });

    it('should respond with the original facebook', function() {
      expect(updatedFacebook.name).to.equal('New Facebook');
      expect(updatedFacebook.info).to.equal('This is the brand new facebook!!!');
    });

    it('should respond with the updated facebook on a subsequent GET', function(done) {
      request(app)
        .get(`/api/facebook/${newFacebook._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          let facebook = res.body;

          expect(facebook.name).to.equal('Updated Facebook');
          expect(facebook.info).to.equal('This is the updated facebook!!!');

          done();
        });
    });
  });

  describe('PATCH /api/facebook/:id', function() {
    var patchedFacebook;

    beforeEach(function(done) {
      request(app)
        .patch(`/api/facebook/${newFacebook._id}`)
        .send([
          { op: 'replace', path: '/name', value: 'Patched Facebook' },
          { op: 'replace', path: '/info', value: 'This is the patched facebook!!!' }
        ])
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          patchedFacebook = res.body;
          done();
        });
    });

    afterEach(function() {
      patchedFacebook = {};
    });

    it('should respond with the patched facebook', function() {
      expect(patchedFacebook.name).to.equal('Patched Facebook');
      expect(patchedFacebook.info).to.equal('This is the patched facebook!!!');
    });
  });

  describe('DELETE /api/facebook/:id', function() {
    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete(`/api/facebook/${newFacebook._id}`)
        .expect(204)
        .end(err => {
          if(err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when facebook does not exist', function(done) {
      request(app)
        .delete(`/api/facebook/${newFacebook._id}`)
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
