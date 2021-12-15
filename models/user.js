const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  plantList: [
    { plant: { type: Schema.Types.ObjectId, ref: 'Plant', required: true } },
  ],
});

userSchema.methods.addToUserPlantList = function(plant) {
  let updatedPlantList;
  const listPlantIndex = this.plantList.findIndex((item) => {
    return item.toString() === plant._id.toString();
  });
  if (listPlantIndex < 0) {
    updatedPlantList = [...this.plantList, {plant: plant._id}];
  } else {
    updatedPlantList = this.plantList;
  }
  this.plantList = updatedPlantList;
  return this.save();
};

userSchema.methods.deleteFromUserPlantList = function(plantId) {
  const updatedPlantList = this.plantList.filter((p) => {
   return p.plant.toString() !== plantId.toString()
  });

  this.plantList = updatedPlantList;
  return this.save();
};

module.exports = mongoose.model('User', userSchema);

// const mongodb = require('mongodb');
// const getDb = require('../util/database').getDb;

// const ObjectId = mongodb.ObjectId;

// class User {
//   constructor(username, email, plantList, id) {
//     this.username = username;
//     this.email = email;
//     this.plantList = plantList ? plantList : [];
//     this._id = id ? new ObjectId(id) : null;
//   }

//   save() {
//     const db = getDb();
//     let dbOp;
//     if (this._id) {
//       dbOp = db
//         .collection('users')
//         .updateOne({ _id: this._id }, { $set: this });
//     } else {
//       dbOp = db.collection('users').insertOne(this);
//     }
//     return dbOp
//       .then((result) => {
//         console.log(result);
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//   }

//   addToPlantList(plantId) {
//     let updatedPlantList;
//     const listPlantIndex = this.plantList.findIndex((lp) => {
//       return lp.toString() === new ObjectId(plantId).toString();
//     });
//     if (listPlantIndex < 0) {
//       updatedPlantList = [...this.plantList, new ObjectId(plantId)];
//     } else {
//       updatedPlantList = this.plantList
//     }

//     const db = getDb();
//     return db
//       .collection('users')
//       .updateOne(
//         { _id: new ObjectId(this._id) },
//         { $set: { plantList: updatedPlantList } }
//       )
//       .then((user) => {
//         return user;
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//   }

//   getMyPlants() {
//     const db = getDb();
//     return db
//       .collection('plants')
//       .find({ _id: { $in: this.plantList } })
//       .toArray()
//       .then((plants) => {
//         return plants;
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//   }

//   deleteFromMyPlants(id) {
//     const updatedPlantList = this.plantList.filter(plant => {
//       return plant.toString() !== id.toString();
//     });
//     const db = getDb();
//     return db
//       .collection('users')
//       .updateOne(
//         { _id: new ObjectId(this._id) },
//         { $set: { plantList: updatedPlantList } }
//       );
//   }

//   static fetchAll() {
//     const db = getDb();
//     return db
//       .collection('users')
//       .find()
//       .toArray()
//       .then((users) => {
//         return users;
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//   }

//   static findById(userId) {
//     const db = getDb();
//     return db
//       .collection('users')
//       .findOne({ _id: new ObjectId(userId) })
//       .then((user) => {
//         return user;
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//   }

//   static deleteById(userId) {
//     const db = getDb();
//     return db
//       .collection('users')
//       .deleteOne({ _id: new ObjectId(userId) })
//       .then(() => {
//         console.log('Deleted!');
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//   }
// }

// module.exports = User;
