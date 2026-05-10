// backend/routes/properties.js
const express = require('express');
const router = express.Router();
const { getProperties, getProperty, addProperty, updateProperty, deleteProperty, getFeatured } = require('../controllers/propertyController');
const { protect, adminOnly } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.get('/', getProperties);
router.get('/featured', getFeatured);
router.get('/:id', getProperty);
router.post('/', protect, upload.array('images', 10), addProperty);
router.put('/:id', protect, adminOnly, updateProperty);
router.delete('/:id', protect, adminOnly, deleteProperty);

module.exports = router;
