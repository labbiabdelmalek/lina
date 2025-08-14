const express = require('express');
const path = require('path');
const multer = require('multer');
const fs = require('fs');
const Article = require('../models/Article');
// const requireAuth = require('../middlewares/requireAuth');

const router = express.Router();

/* ---------- Multer config ---------- */
const uploadDir = process.env.UPLOAD_DIR || path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname || ''));
  }
});

// حدود بسيطة + فلتر لأنواع الصور
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const ok = /image\/(png|jpeg|jpg|webp|gif)/.test(file.mimetype);
    cb(ok ? null : new Error('Type image invalide (png, jpg, jpeg, webp, gif فقط)'));
  }
});

// helper: نرجع 400 برسالة واضحة إذا وقع خطأ من multer
const withUpload = (field) => (req, res, next) =>
  upload.single(field)(req, res, (err) => {
    if (err) {
      console.error('MULTER:', err.message);
      return res.status(400).json({ message: err.message });
    }
    next();
  });

/* ---------- GET: list ---------- */
router.get('/', async (_req, res) => {
  const items = await Article.find().sort({ _id: -1 });
  res.json(items);
});

/* ---------- POST: create (image optional) ---------- */
router.post('/', /*requireAuth,*/ withUpload('image'), async (req, res) => {
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
});

/* ---------- PUT: update (image optional) ---------- */
router.put('/:id', /*requireAuth,*/ withUpload('image'), async (req, res) => {
  try {
    const { titre, contenu } = req.body;
    if (!titre || !contenu) {
      return res.status(400).json({ message: 'titre et contenu sont requis' });
    }
    const update = { titre, contenu };
    if (req.file) update.image = req.file.filename;

    const saved = await Article.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!saved) return res.status(404).json({ message: 'Article introuvable' });
    return res.json(saved);
  } catch (e) {
    console.error('PUT /articles error:', e);
    return res.status(500).json({ message: 'Erreur serveur' });
  }
});

/* ---------- DELETE ---------- */
router.delete('/:id', /*requireAuth,*/ async (req, res) => {
  await Article.findByIdAndDelete(req.params.id);
  res.json({ ok: true });
});

module.exports = router;
