var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var truckSchema = new Schema({
    locationid : { type: Number, required: true, index: true },
    Applicant : { type: String, required: true, default: 'Mobile Food Establishment' },
    FacilityType: String,
    LocationDescription: String,
    Address: String,
    FoodItems: String
}, { collection: 'trucks' });

var truck = mongoose.model('Truck', truckSchema);

module.exports = {
    Truck: truck
};
