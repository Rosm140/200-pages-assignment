// backend/routes/contact.js
const express = require('express');
const router = express.Router();
const { submitInquiry, submitContact, getInquiries, getContactMessages } = require('../controllers/contactController');
const { protect, adminOnly } = require('../middleware/auth');

router.post('/inquiry', submitInquiry);
router.post('/message', submitContact);
router.get('/inquiries', protect, adminOnly, getInquiries);
router.get('/messages', protect, adminOnly, getContactMessages);

module.exports = router;
