// backend/controllers/wishlistController.js
const User = require('../models/User');

exports.addToWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (user.wishlist.includes(req.params.propertyId)) {
      return res.status(400).json({ success: false, message: 'Already in wishlist' });
    }
    user.wishlist.push(req.params.propertyId);
    await user.save();
    res.json({ success: true, message: 'Added to wishlist' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.removeFromWishlist = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user.id, { $pull: { wishlist: req.params.propertyId } });
    res.json({ success: true, message: 'Removed from wishlist' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('wishlist');
    res.json({ success: true, wishlist: user.wishlist });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
