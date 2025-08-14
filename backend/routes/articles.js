const express = require('express');
const path = require('path');
const multer = require('multer');
const Article = require('../models/Article');
// const requireAuth = require('../middlewares/requireAuth');

const router = express.Router();

const uploadDir = process.env.UPLOAD_DIR || path.join(__dirname, '..', 'uploads');

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname || ''));
  }
});
const upload = multer({ storage });

router.get('/', async (_req, res) => {
  const items = await Article.find().sort({ _id: -1 });
  res.json(items);
});

router.post('/', /*requireAuth,*/ upload.single('image'), async (req, res) => {
  try {
    const { titre, contenu } = req.body;
    if (!titre || !contenu) return res.status(400).json({ message: 'titre et contenu sont requis' });
    const image = req.file ? req.file.filename : null;
    const saved = await Article.create({ titre, contenu, image, date: new Date() });
    res.status(201).json(saved);
  } catch (e) {
    console.error('POST /articles error:', e);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

router.put('/:id', /*requireAuth,*/ upload.single('image'), async (req, res) => {
  try {
    const { titre, contenu } = req.body;
    const update = { titre, contenu };
    if (req.file) update.image = req.file.filename;
    const saved = await Article.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!saved) return res.status(404).json({ message: 'Article introuvable' });
    res.json(saved);
  } catch (e) {
    console.error('PUT /articles error:', e);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

router.delete('/:id', /*requireAuth,*/ async (req, res) => {
  await Article.findByIdAndDelete(req.params.id);
  res.json({ ok: true });
});

module.exports = router;
