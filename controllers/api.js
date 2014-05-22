/*
 * Handles the basic api for food trucks
 *
 * Exports basic methods:
 * show - Find a specific food truck
 * list - Return a list of food trucks
 * locate - Based on a location find and return a food truck near it
 */

var Truck = require('../data/models/truck').Truck;

var fields = 'Applicant loc FacilityType FoodItems LocationDescription locationid';

exports.list = function(req, res) {
    Truck.find({}, fields, function(err, trucks) {
        res.send(trucks);
    });
};

exports.show = function(req, res) {
    Truck.findOne({ locationid : req.params.id.toString() }, fields, function(err, truck) {
        res.send({ truck : truck});
    });
};

exports.locate = function(req, res) {
    var lat = parseFloat(req.query.lat);
    var lng = parseFloat(req.query.lng);
    Truck.find({ loc : { $near : [ lng, lat ]} }, fields, { limit: 20 }, function(err, trucks) {
        res.send(trucks);
    });
};
