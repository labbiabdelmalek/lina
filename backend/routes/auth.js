const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Connexion (login)
router.post('/login', async (req, res) => {
  const { email, motdepasse } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ error: "Utilisateur non trouvé" });

  const isMatch = await bcrypt.compare(motdepasse, user.motdepasse);
  if (!isMatch) return res.status(400).json({ error: "Mot de passe incorrect" });

  const token = jwt.sign({ id: user._id }, "votre_jwt_secret", { expiresIn: '1h' });

  res.json({ token });
});

module.exports = router;
