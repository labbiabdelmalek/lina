const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const router = express.Router();

router.get('/create-admin', async (req, res) => {
  try {
    const hashedPwd = await bcrypt.hash('admin123', 10);
    const userExist = await User.findOne({ email: 'admin@email.com' });
    if (userExist) {
      return res.status(400).send('Admin déjà existant');
    }

    const newAdmin = new User({
      email: 'admin@email.com',
      motdepasse: hashedPwd
    });
    await newAdmin.save();
    res.send('Admin créé avec succès');
  } catch (err) {
    console.error(err);
    res.status(500).send('Erreur serveur');
  }
});

module.exports = router;
