// backend/controllers/adminController.js
const User = require('../models/User');
const Property = require('../models/Property');
const Booking = require('../models/Booking');
const Inquiry = require('../models/Inquiry');
const ContactMessage = require('../models/ContactMessage');

exports.getDashboardStats = async (req, res) => {
  try {
    const [totalUsers, totalProperties, totalBookings, totalInquiries, pendingProperties, newMessages] = await Promise.all([
      User.countDocuments({ role: 'user' }),
      Property.countDocuments(),
      Booking.countDocuments(),
      Inquiry.countDocuments(),
      Property.countDocuments({ status: 'pending' }),
      ContactMessage.countDocuments({ status: 'new' })
    ]);
    res.json({ success: true, stats: { totalUsers, totalProperties, totalBookings, totalInquiries, pendingProperties, newMessages } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: 'user' }).select('-password').sort({ createdAt: -1 });
    res.json({ success: true, users });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getAllProperties = async (req, res) => {
  try {
    const properties = await Property.find().populate('postedBy', 'name email').populate('agent', 'name').sort({ createdAt: -1 });
    res.json({ success: true, properties });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.approveProperty = async (req, res) => {
  try {
    const property = await Property.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
    res.json({ success: true, property });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.toggleFeatured = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    property.isFeatured = !property.isFeatured;
    await property.save();
    res.json({ success: true, isFeatured: property.isFeatured });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
