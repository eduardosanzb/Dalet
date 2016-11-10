'use strict';

var app = require('../..');
import request from 'supertest';

var newEntrie;

describe('Entrie API:', function() {
  describe('GET /api/entries', function() {
    var entries;

    beforeEach(function(done) {
      request(app)
        .get('/api/entries')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          entries = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      expect(entries).to.be.instanceOf(Array);
    });
  });

  describe('POST /api/entries', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/entries')
        .send({
          name: 'New Entrie',
          info: 'This is the brand new entrie!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          newEntrie = res.body;
          done();
        });
    });

    it('should respond with the newly created entrie', function() {
      expect(newEntrie.name).to.equal('New Entrie');
      expect(newEntrie.info).to.equal('This is the brand new entrie!!!');
    });
  });

  describe('GET /api/entries/:id', function() {
    var entrie;

    beforeEach(function(done) {
      request(app)
        .get(`/api/entries/${newEntrie._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          entrie = res.body;
          done();
        });
    });

    afterEach(function() {
      entrie = {};
    });

    it('should respond with the requested entrie', function() {
      expect(entrie.name).to.equal('New Entrie');
      expect(entrie.info).to.equal('This is the brand new entrie!!!');
    });
  });

  describe('PUT /api/entries/:id', function() {
    var updatedEntrie;

    beforeEach(function(done) {
      request(app)
        .put(`/api/entries/${newEntrie._id}`)
        .send({
          name: 'Updated Entrie',
          info: 'This is the updated entrie!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          updatedEntrie = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedEntrie = {};
    });

    it('should respond with the original entrie', function() {
      expect(updatedEntrie.name).to.equal('New Entrie');
      expect(updatedEntrie.info).to.equal('This is the brand new entrie!!!');
    });

    it('should respond with the updated entrie on a subsequent GET', function(done) {
      request(app)
        .get(`/api/entries/${newEntrie._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          let entrie = res.body;

          expect(entrie.name).to.equal('Updated Entrie');
          expect(entrie.info).to.equal('This is the updated entrie!!!');

          done();
        });
    });
  });

  describe('PATCH /api/entries/:id', function() {
    var patchedEntrie;

    beforeEach(function(done) {
      request(app)
        .patch(`/api/entries/${newEntrie._id}`)
        .send([
          { op: 'replace', path: '/name', value: 'Patched Entrie' },
          { op: 'replace', path: '/info', value: 'This is the patched entrie!!!' }
        ])
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          patchedEntrie = res.body;
          done();
        });
    });

    afterEach(function() {
      patchedEntrie = {};
    });

    it('should respond with the patched entrie', function() {
      expect(patchedEntrie.name).to.equal('Patched Entrie');
      expect(patchedEntrie.info).to.equal('This is the patched entrie!!!');
    });
  });

  describe('DELETE /api/entries/:id', function() {
    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete(`/api/entries/${newEntrie._id}`)
        .expect(204)
        .end(err => {
          if(err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when entrie does not exist', function(done) {
      request(app)
        .delete(`/api/entries/${newEntrie._id}`)
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
