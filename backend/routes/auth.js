const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken'); // si tu renvoies un token
const User = require('../models/User');

const router = express.Router();

router.post('/login', async (req, res) => {
  try {
    // ⬇️ on récupère EXACTEMENT ces noms
    const { email, motdepasse } = req.body;
    if (!email || !motdepasse) {
      return res.status(400).json({ message: 'Champs manquants' });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Identifiants invalides' });

    const ok = await bcrypt.compare(motdepasse, user.motdepasse);
    if (!ok) return res.status(401).json({ message: 'Identifiants invalides' });

    // Optionnel : créer un token
    const token = jwt.sign({ uid: user._id }, process.env.JWT_SECRET || 'dev-secret', { expiresIn: '7d' });

    res.json({ message: 'OK', token });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

module.exports = router;
