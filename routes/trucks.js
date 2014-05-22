var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var truck = require('../data/models/truck').Truck;

router.get('/', function(req, res) {
    Truck.find({}, function(err, docs) {
        res.render('listTrucks', { trucks: docs});
    });
});

module.exports = router;
