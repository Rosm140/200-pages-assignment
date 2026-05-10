// backend/controllers/contactController.js
const Inquiry = require('../models/Inquiry');
const ContactMessage = require('../models/ContactMessage');

exports.submitInquiry = async (req, res) => {
  try {
    const inquiry = await Inquiry.create({ ...req.body, user: req.user ? req.user.id : undefined });
    res.status(201).json({ success: true, message: 'Inquiry submitted successfully', inquiry });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.submitContact = async (req, res) => {
  try {
    const msg = await ContactMessage.create(req.body);
    res.status(201).json({ success: true, message: 'Message sent successfully', msg });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getInquiries = async (req, res) => {
  try {
    const inquiries = await Inquiry.find().populate('property', 'title').populate('user', 'name').sort({ createdAt: -1 });
    res.json({ success: true, inquiries });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getContactMessages = async (req, res) => {
  try {
    const messages = await ContactMessage.find().sort({ createdAt: -1 });
    res.json({ success: true, messages });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
