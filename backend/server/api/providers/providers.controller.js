/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/providers              ->  index
 * POST    /api/providers              ->  create
 * GET     /api/providers/:id          ->  show
 * PUT     /api/providers/:id          ->  upsert
 * PATCH   /api/providers/:id          ->  patch
 * DELETE  /api/providers/:id          ->  destroy
 */

'use strict';

import jsonpatch from 'fast-json-patch';
import Providers from './providers.model';
import Statistics from './statsProvider.model'
import mongoose from 'mongoose';


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

// Gets a list of Providerss
export function index(req, res) {
  return Providers.find().exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets the stats of the provider
  export function stats(req, res){
    
    var id = mongoose.Types.ObjectId(req.params.id)
    console.log(id);
    return Statistics
        .find({_provider:req.params.id})
        .exec()
        .then(respondWithResult(res))
        .catch(handleError(res))
  }

// Gets a single Providers from the DB
export function show(req, res) {
  return Providers.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new Providers in the DB
export function create(req, res) {
  return Providers.create(req.body)
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}

// Upserts the given Providers in the DB at the specified ID
export function upsert(req, res) {
  if(req.body._id) {
    delete req.body._id;
  }
  return Providers.findOneAndUpdate({_id: req.params.id}, req.body, {upsert: true, setDefaultsOnInsert: true, runValidators: true}).exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Updates an existing Providers in the DB
export function patch(req, res) {
  if(req.body._id) {
    delete req.body._id;
  }
  return Providers.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(patchUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a Providers from the DB
export function destroy(req, res) {
  return Providers.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}
