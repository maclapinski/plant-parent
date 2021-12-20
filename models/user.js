const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  plantList: [
    { plant: { type: Schema.Types.ObjectId, ref: 'Plant', required: true } },
  ],
});

userSchema.methods.addToUserPlantList = function (plant) {
  let updatedPlantList;
  const listPlantIndex = this.plantList.findIndex((item) => {
    return item.toString() === plant._id.toString();
  });
  if (listPlantIndex < 0) {
    updatedPlantList = [...this.plantList, { plant: plant._id }];
  } else {
    updatedPlantList = this.plantList;
  }
  this.plantList = updatedPlantList;
  return this.save();
};

userSchema.methods.deleteFromUserPlantList = function (plantId) {
  const updatedPlantList = this.plantList.filter((p) => {
    return p.plant.toString() !== plantId.toString();
  });

  this.plantList = updatedPlantList;
  return this.save();
};

module.exports = mongoose.model('User', userSchema);