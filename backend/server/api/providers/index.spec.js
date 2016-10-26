'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var providersCtrlStub = {
  index: 'providersCtrl.index',
  show: 'providersCtrl.show',
  create: 'providersCtrl.create',
  upsert: 'providersCtrl.upsert',
  patch: 'providersCtrl.patch',
  destroy: 'providersCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var providersIndex = proxyquire('./index.js', {
  express: {
    Router() {
      return routerStub;
    }
  },
  './providers.controller': providersCtrlStub
});

describe('Providers API Router:', function() {
  it('should return an express router instance', function() {
    expect(providersIndex).to.equal(routerStub);
  });

  describe('GET /api/providers', function() {
    it('should route to providers.controller.index', function() {
      expect(routerStub.get
        .withArgs('/', 'providersCtrl.index')
        ).to.have.been.calledOnce;
    });
  });

  describe('GET /api/providers/:id', function() {
    it('should route to providers.controller.show', function() {
      expect(routerStub.get
        .withArgs('/:id', 'providersCtrl.show')
        ).to.have.been.calledOnce;
    });
  });

  describe('POST /api/providers', function() {
    it('should route to providers.controller.create', function() {
      expect(routerStub.post
        .withArgs('/', 'providersCtrl.create')
        ).to.have.been.calledOnce;
    });
  });

  describe('PUT /api/providers/:id', function() {
    it('should route to providers.controller.upsert', function() {
      expect(routerStub.put
        .withArgs('/:id', 'providersCtrl.upsert')
        ).to.have.been.calledOnce;
    });
  });

  describe('PATCH /api/providers/:id', function() {
    it('should route to providers.controller.patch', function() {
      expect(routerStub.patch
        .withArgs('/:id', 'providersCtrl.patch')
        ).to.have.been.calledOnce;
    });
  });

  describe('DELETE /api/providers/:id', function() {
    it('should route to providers.controller.destroy', function() {
      expect(routerStub.delete
        .withArgs('/:id', 'providersCtrl.destroy')
        ).to.have.been.calledOnce;
    });
  });
});
