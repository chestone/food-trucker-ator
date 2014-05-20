var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var truck = require('../data/models/truck').Truck;

router.get('/', function(req, res) {
    res.render('index', { title: 'Trucks' });
});

module.exports = router;
