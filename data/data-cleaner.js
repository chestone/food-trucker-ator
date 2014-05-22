var csv = require('csv');
var fs = require('fs');
var input = fs.readFile('./data/raw/foodtrucks.csv', { encoding: 'utf8' }, function(err, data) {
    if (err) throw err;
    csv.parse(data, {columns: true}, function(err, data) {
        if (err) throw err;
        data.map(function(obj) {
            if (obj.hasOwnProperty('Latitude') && obj.hasOwnProperty('Longitude')) {
                if (obj.Longitude == "" || obj.Latitude == "" || obj.Location == "") { 
                    obj.loc = "empty";
                } else {
                    obj.loc = [
                        parseFloat(parseFloat(obj.Longitude).toFixed(10)),
                        parseFloat(parseFloat(obj.Latitude).toFixed(10))
                    ];
                }
                delete obj.Latitude;
                delete obj.Longitude;
                delete obj.Location;
            }
            obj.locationid = parseInt(obj.locationid);
            return obj;
        });

        fs.writeFile('./data/raw/foodtrucks-fixed.json', JSON.stringify(data), function(err) {
            if (err) throw err;
        });
    });
});


// Awwww forget that noise let's use streams!
// var transform = require('stream-transform');
//
// var stream = require('stream');
// var transformer = new stream.Transform({ objectMode: true });

// var parser = csv.parse({columns: true});
// var input = fs.createReadStream('./data/raw/foodtrucks.csv');
// var output = fs.createWriteStream('./data/raw/foodtrucks-fixed.json',{ encoding: 'utf8'});
// console.log(transform.toString());
// var transformer = transform(function(record) {
//     if (record.hasOwnProperty('Latitude') && record.hasOwnProperty('Longitude')) {
//         record.loc = {
//             lon : record.Longitude,
//             lat : record.Latitude
//         };
//     }
// });
//
// transformer._transform = function(chunk, encoding, done) {
//     var record = chunk.toString();
//     if (record.hasOwnProperty('Latitude') && record.hasOwnProperty('Longitude')) {
//         record.loc = {
//             lon : record.Longitude,
//             lat : record.Latitude
//         };
//     }
//     console.log(Object.keys(record));
//     done();
// };
//input.pipe(parser).pipe(transformer).pipe(process.stdout);
