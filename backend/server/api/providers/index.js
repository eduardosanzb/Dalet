'use strict';

var express = require('express');
var controller = require('./providers.controller');

var router = express.Router();

router.get('/', controller.index);
router.get('/:id', controller.show);

router.get('/:id/stats/platforms', controller.platform)
router.get('/:id/stats/databases', controller.databases)
router.get('/:id/stats/books', controller.books)
router.get('/:id/stats/journals', controller.journals)

router.post('/', controller.create);
router.post('/:id', controller.upsert);
router.patch('/:id', controller.patch);
router.delete('/:id', controller.destroy);

module.exports = router;
