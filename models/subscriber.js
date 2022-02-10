const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const subscriberSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  subscriptionDate: {
    type: Date,
    default: Date.now,
  },
  subscriptionToken: String,
});

module.exports = mongoose.model('Subscriber', subscriberSchema);