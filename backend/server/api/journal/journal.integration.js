'use strict';

var app = require('../..');
import request from 'supertest';

var newJournal;

describe('Journal API:', function() {
  describe('GET /api/journals', function() {
    var journals;

    beforeEach(function(done) {
      request(app)
        .get('/api/journals')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          journals = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      expect(journals).to.be.instanceOf(Array);
    });
  });

  describe('POST /api/journals', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/journals')
        .send({
          name: 'New Journal',
          info: 'This is the brand new journal!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          newJournal = res.body;
          done();
        });
    });

    it('should respond with the newly created journal', function() {
      expect(newJournal.name).to.equal('New Journal');
      expect(newJournal.info).to.equal('This is the brand new journal!!!');
    });
  });

  describe('GET /api/journals/:id', function() {
    var journal;

    beforeEach(function(done) {
      request(app)
        .get(`/api/journals/${newJournal._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          journal = res.body;
          done();
        });
    });

    afterEach(function() {
      journal = {};
    });

    it('should respond with the requested journal', function() {
      expect(journal.name).to.equal('New Journal');
      expect(journal.info).to.equal('This is the brand new journal!!!');
    });
  });

  describe('PUT /api/journals/:id', function() {
    var updatedJournal;

    beforeEach(function(done) {
      request(app)
        .put(`/api/journals/${newJournal._id}`)
        .send({
          name: 'Updated Journal',
          info: 'This is the updated journal!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          updatedJournal = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedJournal = {};
    });

    it('should respond with the original journal', function() {
      expect(updatedJournal.name).to.equal('New Journal');
      expect(updatedJournal.info).to.equal('This is the brand new journal!!!');
    });

    it('should respond with the updated journal on a subsequent GET', function(done) {
      request(app)
        .get(`/api/journals/${newJournal._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          let journal = res.body;

          expect(journal.name).to.equal('Updated Journal');
          expect(journal.info).to.equal('This is the updated journal!!!');

          done();
        });
    });
  });

  describe('PATCH /api/journals/:id', function() {
    var patchedJournal;

    beforeEach(function(done) {
      request(app)
        .patch(`/api/journals/${newJournal._id}`)
        .send([
          { op: 'replace', path: '/name', value: 'Patched Journal' },
          { op: 'replace', path: '/info', value: 'This is the patched journal!!!' }
        ])
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          patchedJournal = res.body;
          done();
        });
    });

    afterEach(function() {
      patchedJournal = {};
    });

    it('should respond with the patched journal', function() {
      expect(patchedJournal.name).to.equal('Patched Journal');
      expect(patchedJournal.info).to.equal('This is the patched journal!!!');
    });
  });

  describe('DELETE /api/journals/:id', function() {
    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete(`/api/journals/${newJournal._id}`)
        .expect(204)
        .end(err => {
          if(err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when journal does not exist', function(done) {
      request(app)
        .delete(`/api/journals/${newJournal._id}`)
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
