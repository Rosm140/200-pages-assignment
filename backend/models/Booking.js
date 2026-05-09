// backend/models/Booking.js
const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  property: { type: mongoose.Schema.Types.ObjectId, ref: 'Property', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  agent: { type: mongoose.Schema.Types.ObjectId, ref: 'Agent' },
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  visitDate: { type: Date, required: true },
  visitTime: { type: String, required: true },
  message: { type: String, default: '' },
  status: { type: String, enum: ['pending', 'confirmed', 'cancelled', 'completed'], default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Booking', bookingSchema);
