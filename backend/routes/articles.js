// backend/routes/articles.js
const express = require('express');
const router = express.Router();
const Article = require('../models/Article');

// GET /api/articles : liste des articles
router.get('/', async (req, res) => {
  try {
    const articles = await Article.find().sort({ date: -1 });
    res.json(articles);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur lors de la récupération des articles' });
  }
});

// (facultatif) GET /api/articles/:id
router.get('/:id', async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) return res.status(404).json({ error: 'Introuvable' });
    res.json(article);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// (facultatif) POST /api/articles
router.post('/', async (req, res) => {
  try {
    const { titre, contenu, image } = req.body;
    const created = await Article.create({ titre, contenu, image });
    res.status(201).json(created);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'Données invalides' });
  }
});

// (facultatif) PUT /api/articles/:id
router.put('/:id', async (req, res) => {
  try {
    const { titre, contenu, image } = req.body;
    const updated = await Article.findByIdAndUpdate(
      req.params.id,
      { titre, contenu, image },
      { new: true }
    );
    if (!updated) return res.status(404).json({ error: 'Introuvable' });
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'Mise à jour impossible' });
  }
});

// (facultatif) DELETE /api/articles/:id
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Article.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Introuvable' });
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Suppression impossible' });
  }
});

module.exports = router;
