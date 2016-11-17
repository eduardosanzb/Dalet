'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var facebookCtrlStub = {
  index: 'facebookCtrl.index',
  show: 'facebookCtrl.show',
  create: 'facebookCtrl.create',
  upsert: 'facebookCtrl.upsert',
  patch: 'facebookCtrl.patch',
  destroy: 'facebookCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var facebookIndex = proxyquire('./index.js', {
  express: {
    Router() {
      return routerStub;
    }
  },
  './facebook.controller': facebookCtrlStub
});

describe('Facebook API Router:', function() {
  it('should return an express router instance', function() {
    expect(facebookIndex).to.equal(routerStub);
  });

  describe('GET /api/facebook', function() {
    it('should route to facebook.controller.index', function() {
      expect(routerStub.get
        .withArgs('/', 'facebookCtrl.index')
        ).to.have.been.calledOnce;
    });
  });

  describe('GET /api/facebook/:id', function() {
    it('should route to facebook.controller.show', function() {
      expect(routerStub.get
        .withArgs('/:id', 'facebookCtrl.show')
        ).to.have.been.calledOnce;
    });
  });

  describe('POST /api/facebook', function() {
    it('should route to facebook.controller.create', function() {
      expect(routerStub.post
        .withArgs('/', 'facebookCtrl.create')
        ).to.have.been.calledOnce;
    });
  });

  describe('PUT /api/facebook/:id', function() {
    it('should route to facebook.controller.upsert', function() {
      expect(routerStub.put
        .withArgs('/:id', 'facebookCtrl.upsert')
        ).to.have.been.calledOnce;
    });
  });

  describe('PATCH /api/facebook/:id', function() {
    it('should route to facebook.controller.patch', function() {
      expect(routerStub.patch
        .withArgs('/:id', 'facebookCtrl.patch')
        ).to.have.been.calledOnce;
    });
  });

  describe('DELETE /api/facebook/:id', function() {
    it('should route to facebook.controller.destroy', function() {
      expect(routerStub.delete
        .withArgs('/:id', 'facebookCtrl.destroy')
        ).to.have.been.calledOnce;
    });
  });
});
