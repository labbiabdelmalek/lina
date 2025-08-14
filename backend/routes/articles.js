const express = require('express');
const path = require('path');
const multer = require('multer');
const Article = require('../models/Article'); // تأكد من المسار
const requireAuth = require('../middlewares/requireAuth'); // إذا بغيت الحماية

const router = express.Router();

// إعداد التخزين للصور
const storage = multer.diskStorage({
  destination: 'uploads',
  filename: (_req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname || ''));
  }
});
const upload = multer({ storage });

// قائمة المقالات (عمومي/أو محمي)
router.get('/', async (_req, res) => {
  const items = await Article.find().sort({ _id: -1 });
  res.json(items);
});

// إضافة مقال
router.post('/', requireAuth, upload.single('image'), async (req, res) => {
  const { titre, contenu } = req.body;
  const image = req.file ? req.file.filename : null;
  const a = await Article.create({ titre, contenu, image, date: new Date() });
  res.json(a);
});

// تعديل مقال (الصورة اختيارية)
router.put('/:id', requireAuth, upload.single('image'), async (req, res) => {
  const { titre, contenu } = req.body;
  const upd = { titre, contenu };
  if (req.file) upd.image = req.file.filename;
  const a = await Article.findByIdAndUpdate(req.params.id, upd, { new: true });
  res.json(a);
});

// حذف
router.delete('/:id', requireAuth, async (req, res) => {
  await Article.findByIdAndDelete(req.params.id);
  res.json({ ok: true });
});

module.exports = router;
