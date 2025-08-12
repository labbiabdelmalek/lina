const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken'); // si tu renvoies un token
const User = require('../models/User');

const router = express.Router();

router.post('/login', async (req, res) => {
  const { email, motdepasse } = req.body; // <<< IMPORTANT: 'motdepasse'
  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ message: 'Identifiants invalides' });

  const ok = await bcrypt.compare(motdepasse, user.motdepasse); // <<< motdepasse
  if (!ok) return res.status(401).json({ message: 'Identifiants invalides' });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' }); 
  res.json({ token });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

module.exports = router;
