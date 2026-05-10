// backend/routes/bookings.js
const express = require('express');
const router = express.Router();
const { createBooking, getUserBookings, getAllBookings, updateBookingStatus } = require('../controllers/bookingController');
const { protect, adminOnly } = require('../middleware/auth');

router.post('/', protect, createBooking);
router.get('/my', protect, getUserBookings);
router.get('/', protect, adminOnly, getAllBookings);
router.put('/:id/status', protect, adminOnly, updateBookingStatus);

module.exports = router;
