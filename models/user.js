const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    required: false,
  },
  googleId: {
    type: String,
    required: false,
  },
  facebookId: {
    type: String,
    required: false,
  },
  image: {
    type: String,
    required: false,
  },
  password: {
    type: String,
    required: false,
  },
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  displayName: {
    type: String,
  },
  plantList: [{ plant: { type: Schema.Types.ObjectId, ref: "Plant", required: true } }],
  wishList: [{ plant: { type: Schema.Types.ObjectId, ref: "Plant", required: true } }],
  isAdmin: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  isPremium:  {
    type: Boolean,
    default: false,
  },
  premiumSubscriptionToken: String,
  premiumSubscriptionTokenExpiration: Date,
  resetToken: String,
  resetTokenExpiration: Date,
});

userSchema.methods.addToUserPlantList = function (plant, deleteFromWishList) {
  let updatedPlantList;
  const listPlantIndex = this.plantList.findIndex((item) => {
    return item.plant._id.toString() === plant._id.toString();
  });
  if (listPlantIndex < 0) {
    updatedPlantList = [...this.plantList, { plant: plant._id }];
  } else {
    updatedPlantList = this.plantList;
  }
  this.plantList = updatedPlantList;
  return this.save();
};

userSchema.methods.addToUserWishList = function (plant) {
  let updatedWishList;
  const listPlantIndex = this.wishList.findIndex((item) => {
    return item.toString() === plant._id.toString();
  });
  if (listPlantIndex < 0) {
    updatedWishList = [...this.wishList, { plant: plant._id }];
  } else {
    updatedWishList = this.wishList;
  }
  this.wishList = updatedWishList;
  return this.save();
};

userSchema.methods.deleteFromUserPlantList = function (plantId) {
  const updatedPlantList = this.plantList.filter((p) => {
    return p.plant.toString() !== plantId.toString();
  });

  this.plantList = updatedPlantList;
  return this.save();
};

userSchema.methods.deleteFromUserWishList = function (plantId) {
  const updatedWishList = this.wishList.filter((p) => {
    return p.plant.toString() !== plantId.toString();
  });

  this.wishList = updatedWishList;
  return this.save();
};

userSchema.methods.setPremiumToken = function (token) {
  this.premiumSubscriptionToken = token;
  this.premiumSubscriptionTokenExpiration = Date.now() + 3600000;
  return this.save();
};

module.exports = mongoose.model("User", userSchema);
