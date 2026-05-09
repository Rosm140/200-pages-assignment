// backend/models/Property.js
const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  type: { type: String, enum: ['Apartment', 'House', 'Villa', 'Plot', 'Commercial', 'Office', 'Studio'], required: true },
  listingType: { type: String, enum: ['Buy', 'Rent'], required: true },
  price: { type: Number, required: true },
  priceUnit: { type: String, enum: ['total', 'per_month', 'per_sqft'], default: 'total' },
  area: { type: Number, required: true }, // in sqft
  bedrooms: { type: Number, default: 0 },
  bathrooms: { type: Number, default: 0 },
  furnished: { type: String, enum: ['Furnished', 'Semi-Furnished', 'Unfurnished'], default: 'Unfurnished' },
  parking: { type: Boolean, default: false },
  address: {
    street: String,
    city: { type: String, required: true },
    state: String,
    pincode: String,
    locality: String
  },
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], default: [0, 0] }
  },
  images: [{ type: String }],
  amenities: [{ type: String }],
  agent: { type: mongoose.Schema.Types.ObjectId, ref: 'Agent' },
  postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  isNew: { type: Boolean, default: true },
  isFeatured: { type: Boolean, default: false },
  views: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

propertySchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Property', propertySchema);
