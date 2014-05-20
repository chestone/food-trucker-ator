/*
 * Handles the basic api for food trucks
 *
 * Exports basic methods:
 * show - Find a specific food truck
 * list - Return a list of food trucks
 * locate - Based on a location find and return a food truck near it
 */

var Truck = require('../data/models/truck').Truck;
console.log(Truck.find);

exports.list = function(req, res) {
    Truck.find({}, function(err, trucks) {
        res.send(trucks);
    });
};

exports.show = function(req, res) {
    Truck.findOne({ locationid : req.params.id }, function(err, truck) {
        res.send({ truck : truck});
    });
};

exports.locate = function(req, res) {
    Truck.find({}, function(err, trucks) {
        res.send(trucks);
    });
};
