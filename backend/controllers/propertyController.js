// backend/controllers/propertyController.js
const Property = require('../models/Property');

// @desc  Get all properties with filters
// @route GET /api/properties
exports.getProperties = async (req, res) => {
  try {
    const { city, type, listingType, minPrice, maxPrice, bedrooms, bathrooms, furnished, parking, minArea, maxArea, isNew, search, page = 1, limit = 12 } = req.query;
    const query = { status: 'approved' };
    if (city) query['address.city'] = new RegExp(city, 'i');
    if (type) query.type = type;
    if (listingType) query.listingType = listingType;
    if (minPrice || maxPrice) query.price = { ...(minPrice && { $gte: Number(minPrice) }), ...(maxPrice && { $lte: Number(maxPrice) }) };
    if (bedrooms) query.bedrooms = { $gte: Number(bedrooms) };
    if (bathrooms) query.bathrooms = { $gte: Number(bathrooms) };
    if (furnished) query.furnished = furnished;
    if (parking) query.parking = parking === 'true';
    if (minArea || maxArea) query.area = { ...(minArea && { $gte: Number(minArea) }), ...(maxArea && { $lte: Number(maxArea) }) };
    if (isNew) query.isNew = isNew === 'true';
    if (search) query.$or = [{ title: new RegExp(search, 'i') }, { 'address.city': new RegExp(search, 'i') }, { 'address.locality': new RegExp(search, 'i') }];

    const total = await Property.countDocuments(query);
    const properties = await Property.find(query)
      .populate('agent', 'name avatar phone')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({ success: true, total, page: Number(page), pages: Math.ceil(total / limit), properties });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc  Get single property
// @route GET /api/properties/:id
exports.getProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id).populate('agent').populate('postedBy', 'name email');
    if (!property) return res.status(404).json({ success: false, message: 'Property not found' });
    property.views += 1;
    await property.save();
    res.json({ success: true, property });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc  Add property
// @route POST /api/properties
exports.addProperty = async (req, res) => {
  try {
    const images = req.files ? req.files.map(f => `/uploads/${f.filename}`) : [];
    const property = await Property.create({ ...req.body, images, postedBy: req.user.id });
    res.status(201).json({ success: true, property });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc  Update property
// @route PUT /api/properties/:id
exports.updateProperty = async (req, res) => {
  try {
    const property = await Property.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!property) return res.status(404).json({ success: false, message: 'Property not found' });
    res.json({ success: true, property });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc  Delete property
// @route DELETE /api/properties/:id
exports.deleteProperty = async (req, res) => {
  try {
    await Property.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Property deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc  Get featured properties
// @route GET /api/properties/featured
exports.getFeatured = async (req, res) => {
  try {
    const properties = await Property.find({ isFeatured: true, status: 'approved' }).limit(6).populate('agent', 'name avatar');
    res.json({ success: true, properties });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
