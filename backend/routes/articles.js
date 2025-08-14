const express = require('express');
const path = require('path');
const multer = require('multer');
const fs = require('fs');
const Article = require('../models/Article');
// const requireAuth = require('../middlewares/requireAuth');

const router = express.Router();

/* === Upload dir (نفس اللي تعرّفو فـserver.js) === */
const uploadDir = process.env.UPLOAD_DIR || path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

/* === Multer === */
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname || ''));
  }
});
// نقبل أي multipart؛ غادي نخدم غير أول ملف كصورة
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

/* === Helper: قرا الحقول كيف ما جاو (multipart أو JSON) === */
function readPayload(req) {
  // من multipart: req.body كيتعمّر سترينگات
  // من JSON: req.body هو نفسو
  let titre = req.body?.titre ?? '';
  let contenu = req.body?.contenu ?? '';

  // ديرهم سترينگ وحتّى trim
  if (titre !== undefined && titre !== null) titre = String(titre).trim();
  if (contenu !== undefined && contenu !== null) contenu = String(contenu).trim();

  // خْذ أول ملف (إلا كان) كصورة
  let image = null;
  if (Array.isArray(req.files) && req.files.length) {
    image = req.files[0].filename;
  } else if (req.file) {
    image = req.file.filename;
  }

  return { titre, contenu, image };
}

/* === GET: list (public) === */
router.get('/', async (_req, res) => {
  const items = await Article.find().sort({ _id: -1 });
  res.json(items);
});

/* === POST: create (image اختيارية) === */
router.post(
  '/',
  // requireAuth,
  (req, res, next) => {
    // إذا جا JSON: خلّيه يدوز بلا multer
    if (req.is('application/json')) return next();
    // إذا جا multipart: خليه يمرّ عبر multer.any()
    return upload.any()(req, res, next);
  },
  async (req, res) => {
    try {
      const { titre, contenu, image } = readPayload(req);

      if (!titre || !contenu) {
        return res.status(400).json({
          message: 'titre et contenu sont requis',
          debug: { bodyKeys: Object.keys(req.body || {}), hasFiles: !!(req.files?.length || req.file) }
        });
      }

      const saved = await Article.create({
        titre,
        contenu,
        image: image || null,
        date: new Date()
      });
      return res.status(201).json(saved);
    } catch (e) {
      console.error('POST /articles error:', e);
      return res.status(500).json({ message: 'Erreur serveur' });
    }
  }
);

/* === PUT: update (image اختيارية) === */
router.put(
  '/:id',
  // requireAuth,
  (req, res, next) => {
    if (req.is('application/json')) return next();
    return upload.any()(req, res, next);
  },
  async (req, res) => {
    try {
      const { titre, contenu, image } = readPayload(req);

      if (!titre || !contenu) {
        return res.status(400).json({
          message: 'titre et contenu sont requis',
          debug: { bodyKeys: Object.keys(req.body || {}), hasFiles: !!(req.files?.length || req.file) }
        });
      }

      const update = { titre, contenu };
      if (image) update.image = image;

      const saved = await Article.findByIdAndUpdate(req.params.id, update, { new: true });
      if (!saved) return res.status(404).json({ message: 'Article introuvable' });
      return res.json(saved);
    } catch (e) {
      console.error('PUT /articles error:', e);
      return res.status(500).json({ message: 'Erreur serveur' });
    }
  }
);

/* === DELETE === */
router.delete('/:id', /*requireAuth,*/ async (req, res) => {
  await Article.findByIdAndDelete(req.params.id);
  res.json({ ok: true });
});

module.exports = router;
