const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    default: ''
  },
  date: {
    type: String,
    required: true
  },

  time: {
    type: String,
    required: true
  },

  location: {
    type: String,
    default: ''
  },

  url: {
    type: String,
    default: ''
  },

  eventType: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'EventType',
    required: true
  },

  color: {
    type: String,
    required: true
  },
  
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  googleCalendarId: {
    type: String,
    default: null
  },

  googleCalendarSynced: {
    type: Boolean,
    default: false
  }

}, {
  timestamps: true
});

module.exports = mongoose.model('Event', eventSchema);