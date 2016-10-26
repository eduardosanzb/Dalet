'use strict';

var app = require('../..');
import request from 'supertest';

var newProviders;

describe('Providers API:', function() {
  describe('GET /api/providers', function() {
    var providerss;

    beforeEach(function(done) {
      request(app)
        .get('/api/providers')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          providerss = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      expect(providerss).to.be.instanceOf(Array);
    });
  });

  describe('POST /api/providers', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/providers')
        .send({
          name: 'New Providers',
          info: 'This is the brand new providers!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          newProviders = res.body;
          done();
        });
    });

    it('should respond with the newly created providers', function() {
      expect(newProviders.name).to.equal('New Providers');
      expect(newProviders.info).to.equal('This is the brand new providers!!!');
    });
  });

  describe('GET /api/providers/:id', function() {
    var providers;

    beforeEach(function(done) {
      request(app)
        .get(`/api/providers/${newProviders._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          providers = res.body;
          done();
        });
    });

    afterEach(function() {
      providers = {};
    });

    it('should respond with the requested providers', function() {
      expect(providers.name).to.equal('New Providers');
      expect(providers.info).to.equal('This is the brand new providers!!!');
    });
  });

  describe('PUT /api/providers/:id', function() {
    var updatedProviders;

    beforeEach(function(done) {
      request(app)
        .put(`/api/providers/${newProviders._id}`)
        .send({
          name: 'Updated Providers',
          info: 'This is the updated providers!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          updatedProviders = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedProviders = {};
    });

    it('should respond with the original providers', function() {
      expect(updatedProviders.name).to.equal('New Providers');
      expect(updatedProviders.info).to.equal('This is the brand new providers!!!');
    });

    it('should respond with the updated providers on a subsequent GET', function(done) {
      request(app)
        .get(`/api/providers/${newProviders._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          let providers = res.body;

          expect(providers.name).to.equal('Updated Providers');
          expect(providers.info).to.equal('This is the updated providers!!!');

          done();
        });
    });
  });

  describe('PATCH /api/providers/:id', function() {
    var patchedProviders;

    beforeEach(function(done) {
      request(app)
        .patch(`/api/providers/${newProviders._id}`)
        .send([
          { op: 'replace', path: '/name', value: 'Patched Providers' },
          { op: 'replace', path: '/info', value: 'This is the patched providers!!!' }
        ])
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          patchedProviders = res.body;
          done();
        });
    });

    afterEach(function() {
      patchedProviders = {};
    });

    it('should respond with the patched providers', function() {
      expect(patchedProviders.name).to.equal('Patched Providers');
      expect(patchedProviders.info).to.equal('This is the patched providers!!!');
    });
  });

  describe('DELETE /api/providers/:id', function() {
    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete(`/api/providers/${newProviders._id}`)
        .expect(204)
        .end(err => {
          if(err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when providers does not exist', function(done) {
      request(app)
        .delete(`/api/providers/${newProviders._id}`)
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
