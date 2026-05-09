// backend/models/Blog.js
const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, unique: true },
  excerpt: { type: String, required: true },
  content: { type: String, required: true },
  coverImage: { type: String, default: '' },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  authorName: { type: String, default: 'HomeQuest Team' },
  category: { type: String, default: 'Real Estate' },
  tags: [{ type: String }],
  isPublished: { type: Boolean, default: false },
  views: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Blog', blogSchema);
