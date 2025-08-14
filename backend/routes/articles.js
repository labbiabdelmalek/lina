// backend/routes/articles.js
const express = require('express');
const path = require('path');
const multer = require('multer');
const Article = require('../models/Article'); // { titre, contenu, image?, date? }
// const requireAuth = require('../middlewares/requireAuth'); // فعّلها إلا بغيتي حماية

const router = express.Router();

/* ---------- Multer (uploads/) ---------- */
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, 'uploads'),
  filename: (_req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname || ''));
  }
});
const upload = multer({ storage });

/* ---------- GET: list ---------- */
router.get('/', async (_req, res) => {
  const items = await Article.find().sort({ _id: -1 });
  res.json(items);
});

/* ---------- POST: create (image optional) ---------- */
router.post(
  '/',
  // requireAuth,
  upload.single('image'),
  async (req, res) => {
    try {
      const { titre, contenu } = req.body;
      if (!titre || !contenu) {
        return res.status(400).json({ message: 'titre et contenu sont requis' });
      }
      const image = req.file ? req.file.filename : null;
      const saved = await Article.create({
        titre,
        contenu,
        image,
        date: new Date()
      });
      return res.status(201).json(saved);
    } catch (e) {
      console.error('POST /articles error:', e);
      return res.status(500).json({ message: 'Erreur serveur' });
    }
  }
);

/* ---------- PUT: update (image optional) ---------- */
router.put(
  '/:id',
  // requireAuth,
  upload.single('image'),
  async (req, res) => {
    try {
      const { titre, contenu } = req.body;
      const update = { titre, contenu };
      if (req.file) update.image = req.file.filename;
      const saved = await Article.findByIdAndUpdate(req.params.id, update, { new: true });
      if (!saved) return res.status(404).json({ message: 'Article introuvable' });
      return res.json(saved);
    } catch (e) {
      console.error('PUT /articles error:', e);
      return res.status(500).json({ message: 'Erreur serveur' });
    }
  }
);

/* ---------- DELETE ---------- */
router.delete('/:id', /*requireAuth,*/ async (req, res) => {
  await Article.findByIdAndDelete(req.params.id);
  res.json({ ok: true });
});

module.exports = router;
