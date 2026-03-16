const mongoose = require('mongoose');

const eventTypeSchema = new mongoose.Schema({

  name: {
    type: String,
    required: true,
    trim: true
  },

  color: {
    type: String,
    required: true
  },

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  }

}, {
  timestamps: true
});

module.exports = mongoose.model('EventType', eventTypeSchema);