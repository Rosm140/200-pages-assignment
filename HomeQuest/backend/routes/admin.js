// backend/routes/admin.js
const express = require('express');
const router = express.Router();
const { getDashboardStats, getAllUsers, getAllProperties, approveProperty, toggleFeatured } = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/auth');

router.use(protect, adminOnly);
router.get('/stats', getDashboardStats);
router.get('/users', getAllUsers);
router.get('/properties', getAllProperties);
router.put('/properties/:id/approve', approveProperty);
router.put('/properties/:id/featured', toggleFeatured);

module.exports = router;
