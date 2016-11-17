'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var journalCtrlStub = {
  index: 'journalCtrl.index',
  show: 'journalCtrl.show',
  create: 'journalCtrl.create',
  upsert: 'journalCtrl.upsert',
  patch: 'journalCtrl.patch',
  destroy: 'journalCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var journalIndex = proxyquire('./index.js', {
  express: {
    Router() {
      return routerStub;
    }
  },
  './journal.controller': journalCtrlStub
});

describe('Journal API Router:', function() {
  it('should return an express router instance', function() {
    expect(journalIndex).to.equal(routerStub);
  });

  describe('GET /api/journals', function() {
    it('should route to journal.controller.index', function() {
      expect(routerStub.get
        .withArgs('/', 'journalCtrl.index')
        ).to.have.been.calledOnce;
    });
  });

  describe('GET /api/journals/:id', function() {
    it('should route to journal.controller.show', function() {
      expect(routerStub.get
        .withArgs('/:id', 'journalCtrl.show')
        ).to.have.been.calledOnce;
    });
  });

  describe('POST /api/journals', function() {
    it('should route to journal.controller.create', function() {
      expect(routerStub.post
        .withArgs('/', 'journalCtrl.create')
        ).to.have.been.calledOnce;
    });
  });

  describe('PUT /api/journals/:id', function() {
    it('should route to journal.controller.upsert', function() {
      expect(routerStub.put
        .withArgs('/:id', 'journalCtrl.upsert')
        ).to.have.been.calledOnce;
    });
  });

  describe('PATCH /api/journals/:id', function() {
    it('should route to journal.controller.patch', function() {
      expect(routerStub.patch
        .withArgs('/:id', 'journalCtrl.patch')
        ).to.have.been.calledOnce;
    });
  });

  describe('DELETE /api/journals/:id', function() {
    it('should route to journal.controller.destroy', function() {
      expect(routerStub.delete
        .withArgs('/:id', 'journalCtrl.destroy')
        ).to.have.been.calledOnce;
    });
  });
});
