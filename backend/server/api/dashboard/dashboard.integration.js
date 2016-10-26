'use strict';

var app = require('../..');
import request from 'supertest';

var newDashboard;

describe('Dashboard API:', function() {
  describe('GET /api/dashboard', function() {
    var dashboards;

    beforeEach(function(done) {
      request(app)
        .get('/api/dashboard')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          dashboards = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      expect(dashboards).to.be.instanceOf(Array);
    });
  });

  describe('POST /api/dashboard', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/dashboard')
        .send({
          name: 'New Dashboard',
          info: 'This is the brand new dashboard!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          newDashboard = res.body;
          done();
        });
    });

    it('should respond with the newly created dashboard', function() {
      expect(newDashboard.name).to.equal('New Dashboard');
      expect(newDashboard.info).to.equal('This is the brand new dashboard!!!');
    });
  });

  describe('GET /api/dashboard/:id', function() {
    var dashboard;

    beforeEach(function(done) {
      request(app)
        .get(`/api/dashboard/${newDashboard._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          dashboard = res.body;
          done();
        });
    });

    afterEach(function() {
      dashboard = {};
    });

    it('should respond with the requested dashboard', function() {
      expect(dashboard.name).to.equal('New Dashboard');
      expect(dashboard.info).to.equal('This is the brand new dashboard!!!');
    });
  });

  describe('PUT /api/dashboard/:id', function() {
    var updatedDashboard;

    beforeEach(function(done) {
      request(app)
        .put(`/api/dashboard/${newDashboard._id}`)
        .send({
          name: 'Updated Dashboard',
          info: 'This is the updated dashboard!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          updatedDashboard = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedDashboard = {};
    });

    it('should respond with the original dashboard', function() {
      expect(updatedDashboard.name).to.equal('New Dashboard');
      expect(updatedDashboard.info).to.equal('This is the brand new dashboard!!!');
    });

    it('should respond with the updated dashboard on a subsequent GET', function(done) {
      request(app)
        .get(`/api/dashboard/${newDashboard._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          let dashboard = res.body;

          expect(dashboard.name).to.equal('Updated Dashboard');
          expect(dashboard.info).to.equal('This is the updated dashboard!!!');

          done();
        });
    });
  });

  describe('PATCH /api/dashboard/:id', function() {
    var patchedDashboard;

    beforeEach(function(done) {
      request(app)
        .patch(`/api/dashboard/${newDashboard._id}`)
        .send([
          { op: 'replace', path: '/name', value: 'Patched Dashboard' },
          { op: 'replace', path: '/info', value: 'This is the patched dashboard!!!' }
        ])
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          patchedDashboard = res.body;
          done();
        });
    });

    afterEach(function() {
      patchedDashboard = {};
    });

    it('should respond with the patched dashboard', function() {
      expect(patchedDashboard.name).to.equal('Patched Dashboard');
      expect(patchedDashboard.info).to.equal('This is the patched dashboard!!!');
    });
  });

  describe('DELETE /api/dashboard/:id', function() {
    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete(`/api/dashboard/${newDashboard._id}`)
        .expect(204)
        .end(err => {
          if(err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when dashboard does not exist', function(done) {
      request(app)
        .delete(`/api/dashboard/${newDashboard._id}`)
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
