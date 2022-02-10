const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const plantSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  }, 
  difficulty: {
    type: String,
    enumValues: ['easy', 'medium', 'advanced'],
    required: true,
  },
  light: {
    type: [String],
    required: true,
  },
  petSafe: {
    type: Boolean,
    required: false,
  },
  petSafe: {
    type: Boolean,
    required: true,
  },
});

module.exports = mongoose.model('Plant', plantSchema);