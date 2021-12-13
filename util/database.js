const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

const password = require('./dbpass');

let _db;

const mongoConnect = callback => {
  MongoClient.connect(
    `mongodb+srv://macieklap:${password}@plantparentdb.tfx53.mongodb.net/plantParent?retryWrites=true&w=majority`
  )
    .then((client) => {
      console.log('connected');
      _db = client.db();
      callback();
    })
    .catch((err) => {
      console.log(err);
      throw err;
    });
};

const getDb = () => {
  if (_db) {
    return _db;
  }
  throw 'No database found!';
};

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;
