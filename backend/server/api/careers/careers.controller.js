/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/careers              ->  index
 * POST    /api/careers              ->  create
 * GET     /api/careers/:id          ->  show
 * PUT     /api/careers/:id          ->  upsert
 * PATCH   /api/careers/:id          ->  patch
 * DELETE  /api/careers/:id          ->  destroy
 */

'use strict';

import jsonpatch from 'fast-json-patch';
import Careers from './careers.model';

var node_xj = require("xls-to-json");

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

// Gets a list of Careerss
export function index(req, res) {
  return Careers.find().exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single Careers from the DB
export function show(req, res) {
  return Careers.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new Careers in the DB
export function create(req, res) {
  return Careers.create(req.body)
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}

export function uploadFile(req,res){
  Careers.db.db.dropCollection('careers', function(){
      node_xj({
        input: req.files.file.path,  // input xls 
        output: null // output json  
      }, function(err, result) {
        if(err) {
          console.error(err);
        } else {
          Careers.create(result)
          .then(respondWithResult(res, 201))
          .catch(handleError(res));
          }
      });
  });
}

// Upserts the given Careers in the DB at the specified ID
export function upsert(req, res) {
  if(req.body._id) {
    delete req.body._id;
  }
  return Careers.findOneAndUpdate({_id: req.params.id}, req.body, {upsert: true, setDefaultsOnInsert: true, runValidators: true}).exec()

    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Updates an existing Careers in the DB
export function patch(req, res) {
  if(req.body._id) {
    delete req.body._id;
  }
  return Careers.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(patchUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a Careers from the DB
export function destroy(req, res) {
  return Careers.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}
