const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const router = express.Router();

// POST /setup/reset-admin
router.post('/reset-admin', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) return res.status(400).json({ message: 'email et password sont requis' });

    const hash = await bcrypt.hash(password, 10);

    // crée ou met à jour l’admin
    await User.updateOne(
      { email },
      { $set: { motdepasse: hash } },
      { upsert: true }
    );

    res.json({ ok: true, message: 'Admin réinitialisé.' });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

module.exports = router;
