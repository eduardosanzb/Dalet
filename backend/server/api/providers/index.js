'use strict';

var express = require('express');
var controller = require('./providers.controller');

var router = express.Router();

router.get('/', controller.index);
router.get('/:id', controller.show);
router.get('/:id/stats', controller.stats)
router.post('/', controller.create);
router.post('/:id', controller.upsert);
router.patch('/:id', controller.patch);
router.delete('/:id', controller.destroy);

module.exports = router;
