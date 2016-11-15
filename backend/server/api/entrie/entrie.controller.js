/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/entries              ->  index
 * POST    /api/entries              ->  create
 * GET     /api/entries/:id          ->  show
 * PUT     /api/entries/:id          ->  upsert
 * PATCH   /api/entries/:id          ->  patch
 * DELETE  /api/entries/:id          ->  destroy
 */

'use strict';

import jsonpatch from 'fast-json-patch';
import Entrie from './entrie.model';

function respondWithResult(res, statusCode) {
  statusCode = statusCode || 200;
  return function(entity) {
    if(entity) {
      return res.status(statusCode).json(entity);
    }
    return null;
  };
}

function patchUpdates(patches) {
  return function(entity) {
    try {
      jsonpatch.apply(entity, patches, /*validate*/ true);
    } catch(err) {
      return Promise.reject(err);
    }

    return entity.save();
  };
}

function removeEntity(res) {
  return function(entity) {
    if(entity) {
      return entity.remove()
        .then(() => {
          res.status(204).end();
        });
    }
  };
}

function handleEntityNotFound(res) {
  return function(entity) {
    if(!entity) {
      res.status(404).end();
      return null;
    }
    return entity;
  };
}

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function(err) {
    res.status(statusCode).send(err);
  };
}

// Gets a list of Entries
export function index(req, res) {
  return Entrie.find().exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single Entrie from the DB
export function show(req, res) {
  return Entrie.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// gets a collection of entries in a ertain month

export function getEntries(req, res){
  return Entrie.find(req.query)
    .where('start')
    .gt(req.params.param1)
    .lt(req.params.param2)
    .exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new Entrie in the DB
export function create(req, res) {
  return Entrie.create(req.body)
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}

// Upserts the given Entrie in the DB at the specified ID
export function upsert(req, res) {
  if(req.body._id) {
    delete req.body._id;
  }
  return Entrie.findOneAndUpdate({_id: req.params.id}, req.body, {upsert: true, setDefaultsOnInsert: true, runValidators: true}).exec()

    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Updates an existing Entrie in the DB
export function patch(req, res) {
  if(req.body._id) {
    delete req.body._id;
  }
  return Entrie.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(patchUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a Entrie from the DB
export function destroy(req, res) {
  return Entrie.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}
