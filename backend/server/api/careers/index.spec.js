'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var careersCtrlStub = {
  index: 'careersCtrl.index',
  show: 'careersCtrl.show',
  create: 'careersCtrl.create',
  upsert: 'careersCtrl.upsert',
  patch: 'careersCtrl.patch',
  destroy: 'careersCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var careersIndex = proxyquire('./index.js', {
  express: {
    Router() {
      return routerStub;
    }
  },
  './careers.controller': careersCtrlStub
});

describe('Careers API Router:', function() {
  it('should return an express router instance', function() {
    expect(careersIndex).to.equal(routerStub);
  });

  describe('GET /api/careers', function() {
    it('should route to careers.controller.index', function() {
      expect(routerStub.get
        .withArgs('/', 'careersCtrl.index')
        ).to.have.been.calledOnce;
    });
  });

  describe('GET /api/careers/:id', function() {
    it('should route to careers.controller.show', function() {
      expect(routerStub.get
        .withArgs('/:id', 'careersCtrl.show')
        ).to.have.been.calledOnce;
    });
  });

  describe('POST /api/careers', function() {
    it('should route to careers.controller.create', function() {
      expect(routerStub.post
        .withArgs('/', 'careersCtrl.create')
        ).to.have.been.calledOnce;
    });
  });

  describe('PUT /api/careers/:id', function() {
    it('should route to careers.controller.upsert', function() {
      expect(routerStub.put
        .withArgs('/:id', 'careersCtrl.upsert')
        ).to.have.been.calledOnce;
    });
  });

  describe('PATCH /api/careers/:id', function() {
    it('should route to careers.controller.patch', function() {
      expect(routerStub.patch
        .withArgs('/:id', 'careersCtrl.patch')
        ).to.have.been.calledOnce;
    });
  });

  describe('DELETE /api/careers/:id', function() {
    it('should route to careers.controller.destroy', function() {
      expect(routerStub.delete
        .withArgs('/:id', 'careersCtrl.destroy')
        ).to.have.been.calledOnce;
    });
  });
});
