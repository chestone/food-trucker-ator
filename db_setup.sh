node data/data-cleaner.js
mongoimport -d foodtrucks -c trucks data/raw/foodtrucks-fixed.json --jsonArray
mongo foodtrucks --eval "db.trucks.remove({loc: 'empty'})"
mongo foodtrucks --eval "db.trucks.ensureIndex({loc: '2d'})"
