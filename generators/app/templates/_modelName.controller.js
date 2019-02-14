/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/<%= modelName %>s              ->  index
 * POST    /api/<%= modelName %>s              ->  create
 * GET     /api/<%= modelName %>s/:id          ->  show
 * PUT     /api/<%= modelName %>s/:id          ->  upsert
 * PATCH   /api/<%= modelName %>s/:id          ->  patch
 * DELETE  /api/<%= modelName %>s/:id          ->  destroy
 */

'use strict';

import jsonpatch from 'fast-json-patch';
import <%= modelNameUp %> from './<%= modelName %>.model';

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
      // eslint-disable-next-line prefer-reflect
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

// Gets a list of <%= modelName %>s
export function index(req, res) {
  return <%= modelNameUp %>.find().exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single <%= modelName %> from the DB
export function show(req, res) {
  return <%= modelNameUp %>.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new <%= modelName %> in the DB
export function create(req, res) {
  return <%= modelNameUp %>.create(req.body)
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}

// Upserts the given <%= modelName %> in the DB at the specified ID
export function upsert(req, res) {
  if(req.body._id) {
    Reflect.deleteProperty(req.body, '_id');
  }
  return <%= modelNameUp %>.findOneAndUpdate({_id: req.params.id}, req.body, {new: true, upsert: true, setDefaultsOnInsert: true, runValidators: true}).exec()

    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Updates an existing <%= modelName %> in the DB
export function patch(req, res) {
  if(req.body._id) {
    Reflect.deleteProperty(req.body, '_id');
  }
  return <%= modelNameUp %>.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(patchUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a <%= modelName %> from the DB
export function destroy(req, res) {
  return <%= modelNameUp %>.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}
