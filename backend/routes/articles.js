const express = require('express');
const path = require('path');
const multer = require('multer');
const fs = require('fs');
const Article = require('../models/Article');

const router = express.Router();

/* Uploads dir (نفس اللي تحدد فـserver.js) */
const uploadDir = process.env.UPLOAD_DIR || path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname || ''));
  }
});

/* استقبل أي multipart (صورة/بدون صورة) وخلّي Multer يقرى الحقول */
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }
});

router.get('/', async (_req, res) => {
  const items = await Article.find().sort({ _id: -1 });
  res.json(items);
});

router.post('/', upload.any(), async (req, res) => {
  try {
    // حقول النص (مسمّاة 'titre' و 'contenu' فالفرونت)
    const titre = req.body?.titre ?? '';
    const contenu = req.body?.contenu ?? '';

    if (!titre || !contenu) {
      return res.status(400).json({ message: 'titre et contenu sont requis' });
    }

    // أول ملف كصورة (اختياري)
    const file = Array.isArray(req.files) && req.files.length ? req.files[0] : null;
    const image = file ? file.filename : null;

    const saved = await Article.create({ titre, contenu, image, date: new Date() });
    return res.status(201).json(saved);
  } catch (e) {
    console.error('POST /articles error:', e);
    return res.status(500).json({ message: 'Erreur serveur' });
  }
});

router.put('/:id', upload.any(), async (req, res) => {
  try {
    const titre = req.body?.titre ?? '';
    const contenu = req.body?.contenu ?? '';
    if (!titre || !contenu) {
      return res.status(400).json({ message: 'titre et contenu sont requis' });
    }

    const update = { titre, contenu };
    const file = Array.isArray(req.files) && req.files.length ? req.files[0] : null;
    if (file) update.image = file.filename;

    const saved = await Article.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!saved) return res.status(404).json({ message: 'Article introuvable' });
    return res.json(saved);
  } catch (e) {
    console.error('PUT /articles error:', e);
    return res.status(500).json({ message: 'Erreur serveur' });
  }
});

router.delete('/:id', async (req, res) => {
  await Article.findByIdAndDelete(req.params.id);
  res.json({ ok: true });
});

module.exports = router;
