// backend/routes/wishlist.js
const express = require('express');
const router = express.Router();
const { addToWishlist, removeFromWishlist, getWishlist } = require('../controllers/wishlistController');
const { protect } = require('../middleware/auth');

router.get('/', protect, getWishlist);
router.post('/:propertyId', protect, addToWishlist);
router.delete('/:propertyId', protect, removeFromWishlist);

module.exports = router;
