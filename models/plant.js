const mongodb = require('mongodb');
const getDb = require('../util/database').getDb;

const ObjectId = mongodb.ObjectId;

class Plant {
  constructor(name, description, imageUrl, id, userId) {
    this._id = id ? new ObjectId(id) : null;
    this.name = name;
    this.description = description;
    this.imageUrl = imageUrl;
    this.userId = userId;
  }

  save() {
    const db = getDb();
    let dbOp;
    if (this._id) {
      dbOp = db
        .collection('plants')
        .updateOne({ _id: this._id }, { $set: this });
    } else {
      dbOp = db.collection('plants').insertOne(this);
    }
    return dbOp
      .then((result) => {
        console.log(result);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  static fetchAll() {
    const db = getDb();
    return db
      .collection('plants')
      .find()
      .toArray()
      .then((plants) => {
        return plants;
      })
      .catch((err) => {
        console.log(err);
      });
  }

  static findById(plantId) {
    const db = getDb();
    return db
      .collection('plants')
      .find({ _id: new ObjectId(plantId) })
      .next()
      .then((plant) => {
        return plant;
      })
      .catch((err) => {
        console.log(err);
      });
  }

  static deleteById(plantId) {
    const db = getDb();
    return db
      .collection('plants')
      .deleteOne({ _id: new ObjectId(plantId) })
      .then(() => {
        console.log('Deleted!');
      })
      .catch((err) => {
        console.log(err);
      });
  }
}

module.exports = Plant;
