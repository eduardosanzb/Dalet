'use strict';

var express = require('express');
var controller = require('./entrie.controller');

var router = express.Router();

router.get('/', controller.index);
router.get('/:param1/:param2', controller.getEntries);
router.post('/', controller.create);
router.post('/:id', controller.upsert);
router.patch('/:id', controller.patch);
router.delete('/:id', controller.destroy);

module.exports = router;
