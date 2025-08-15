const express = require('express');
const multer = require('multer');
const { v2: cloudinary } = require('cloudinary');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const Article = require('../models/Article'); // { titre, contenu, image?, date? }

const router = express.Router();

/* Cloudinary (قيم من ENV) */
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/* Multer -> Cloudinary storage */
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'lina-blog',
    resource_type: 'image',
    transformation: [
      { width: 1280, height: 720, crop: 'fill', gravity: 'auto', quality: 'auto' }
    ]
  }
});
const upload = multer({ storage });

/* GET: list */
router.get('/', async (_req, res) => {
  const items = await Article.find().sort({ _id: -1 });
  res.json(items);
});

/* GET: single */
router.get('/:id', async (req, res) => {
  try {
    const item = await Article.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Article introuvable' });
    res.json(item);
  } catch {
    res.status(400).json({ message: 'Id invalide' });
  }
});

/* POST: create (image اختيارية) */
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const titre = (req.body?.titre || '').trim();
    const contenu = (req.body?.contenu || '').trim();
    if (!titre || !contenu) {
      return res.status(400).json({ message: 'titre et contenu sont requis' });
    }
    // Cloudinary كيْرجّع secure_url فـ req.file.path
    const imageUrl = req.file ? req.file.path : null;

    const saved = await Article.create({ titre, contenu, image: imageUrl, date: new Date() });
    res.status(201).json(saved);
  } catch (e) {
    console.error('POST /articles:', e);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

/* PUT: update (image اختيارية) */
router.put('/:id', upload.single('image'), async (req, res) => {
  try {
    const titre = (req.body?.titre || '').trim();
    const contenu = (req.body?.contenu || '').trim();
    if (!titre || !contenu) {
      return res.status(400).json({ message: 'titre et contenu sont requis' });
    }
    const update = { titre, contenu };
    if (req.file) update.image = req.file.path; // رابط Cloudinary

    const saved = await Article.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!saved) return res.status(404).json({ message: 'Article introuvable' });
    res.json(saved);
  } catch (e) {
    console.error('PUT /articles:', e);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

/* DELETE: مابغيناش دابا نحيدو الصورة من Cloudinary */
router.delete('/:id', async (req, res) => {
  await Article.findByIdAndDelete(req.params.id);
  res.json({ ok: true });
});

module.exports = router;
