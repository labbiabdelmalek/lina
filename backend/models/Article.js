const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
  titre: { type: String, required: true },
  contenu: { type: String, required: true },
  image: { type: String },
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Article', articleSchema);
