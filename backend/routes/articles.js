// backend/routes/articles.js
const express = require('express');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const Article = require('../models/Article');

const router = express.Router();

/* ===== Uploads ===== */
const uploadDir = process.env.UPLOAD_DIR || path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const id = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, id + path.extname(file.originalname || ''));
  }
});
const upload = multer({ storage });

/* ===== GET ===== */
router.get('/', async (_req, res) => {
  const items = await Article.find().sort({ _id: -1 });
  res.json(items);
});

/* ===== POST (image اختيارية) ===== */
router.post('/', (req, res, next) => {
  upload.single('image')(req, res, (err) => {
    if (err) return res.status(400).json({ message: err.message });
    next();
  });
}, async (req, res) => {
  try {
    const titre = (req.body?.titre || '').trim();
    const contenu = (req.body?.contenu || '').trim();
    if (!titre || !contenu) {
      return res.status(400).json({ message: 'titre et contenu sont requis' });
    }
    const image = req.file ? req.file.filename : null;
    const saved = await Article.create({ titre, contenu, image, date: new Date() });
    res.status(201).json(saved);
  } catch (e) {
    console.error('POST /articles:', e);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

/* ===== PUT (image اختيارية) ===== */
router.put('/:id', (req, res, next) => {
  upload.single('image')(req, res, (err) => {
    if (err) return res.status(400).json({ message: err.message });
    next();
  });
}, async (req, res) => {
  try {
    const titre = (req.body?.titre || '').trim();
    const contenu = (req.body?.contenu || '').trim();
    if (!titre || !contenu) {
      return res.status(400).json({ message: 'titre et contenu sont requis' });
    }
    const update = { titre, contenu };
    if (req.file) update.image = req.file.filename;

    const saved = await Article.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!saved) return res.status(404).json({ message: 'Article introuvable' });
    res.json(saved);
  } catch (e) {
    console.error('PUT /articles:', e);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

/* ===== DELETE ===== */
router.delete('/:id', async (req, res) => {
  await Article.findByIdAndDelete(req.params.id);
  res.json({ ok: true });
});

module.exports = router;
