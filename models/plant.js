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
  imageUrl: {
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
  isSafeForPets: {
    type: Boolean,
    required: true,
  },
});

module.exports = mongoose.model('Plant', plantSchema);