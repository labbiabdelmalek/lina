// backend/models/Article.js
const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
  titre:   { type: String, required: true, trim: true },
  contenu: { type: String, required: true, trim: true },
  image:   { type: String, default: null },
  date:    { type: Date, default: Date.now }
});

module.exports = mongoose.model('Article', articleSchema);
