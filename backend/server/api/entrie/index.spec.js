'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var entrieCtrlStub = {
  index: 'entrieCtrl.index',
  show: 'entrieCtrl.show',
  create: 'entrieCtrl.create',
  upsert: 'entrieCtrl.upsert',
  patch: 'entrieCtrl.patch',
  destroy: 'entrieCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var entrieIndex = proxyquire('./index.js', {
  express: {
    Router() {
      return routerStub;
    }
  },
  './entrie.controller': entrieCtrlStub
});

describe('Entrie API Router:', function() {
  it('should return an express router instance', function() {
    expect(entrieIndex).to.equal(routerStub);
  });

  describe('GET /api/entries', function() {
    it('should route to entrie.controller.index', function() {
      expect(routerStub.get
        .withArgs('/', 'entrieCtrl.index')
        ).to.have.been.calledOnce;
    });
  });

  describe('GET /api/entries/:id', function() {
    it('should route to entrie.controller.show', function() {
      expect(routerStub.get
        .withArgs('/:id', 'entrieCtrl.show')
        ).to.have.been.calledOnce;
    });
  });

  describe('POST /api/entries', function() {
    it('should route to entrie.controller.create', function() {
      expect(routerStub.post
        .withArgs('/', 'entrieCtrl.create')
        ).to.have.been.calledOnce;
    });
  });

  describe('PUT /api/entries/:id', function() {
    it('should route to entrie.controller.upsert', function() {
      expect(routerStub.put
        .withArgs('/:id', 'entrieCtrl.upsert')
        ).to.have.been.calledOnce;
    });
  });

  describe('PATCH /api/entries/:id', function() {
    it('should route to entrie.controller.patch', function() {
      expect(routerStub.patch
        .withArgs('/:id', 'entrieCtrl.patch')
        ).to.have.been.calledOnce;
    });
  });

  describe('DELETE /api/entries/:id', function() {
    it('should route to entrie.controller.destroy', function() {
      expect(routerStub.delete
        .withArgs('/:id', 'entrieCtrl.destroy')
        ).to.have.been.calledOnce;
    });
  });
});
