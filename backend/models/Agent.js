// backend/models/Agent.js
const mongoose = require('mongoose');

const agentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  avatar: { type: String, default: '' },
  designation: { type: String, default: 'Property Consultant' },
  bio: { type: String, default: '' },
  experience: { type: Number, default: 0 }, // years
  specialization: [{ type: String }],
  city: { type: String, default: '' },
  propertiesSold: { type: Number, default: 0 },
  rating: { type: Number, default: 4.5 },
  totalReviews: { type: Number, default: 0 },
  socialLinks: {
    linkedin: String,
    twitter: String,
    instagram: String
  },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Agent', agentSchema);
