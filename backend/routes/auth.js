// backend/routes/auth.js
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, motdepasse } = req.body;
    if (!email || !motdepasse) {
      return res.status(400).json({ message: 'Email et mot de passe requis' });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Identifiants invalides' });

    const ok = await bcrypt.compare(motdepasse || '', user.motdepasse);
    if (!ok) return res.status(401).json({ message: 'Identifiants invalides' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    // Si تعتمد على الكوكيز فـ الفرونت (axios withCredentials)
    res.cookie('token', token, {
      httpOnly: true,
      secure: true,       // مهم على Render (HTTPS)
      sameSite: 'None',   // باش يدوز الكوكي عبر الدومينات
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    // نرجّعو OK (وحتى token إذا بغيتي تستعملو محلياً)
    return res.json({ ok: true, token });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: 'Erreur serveur' });
  }
});

// GET /api/auth/me (اختياري للتأكّد من الجلسة)
router.get('/me', (req, res) => {
  try {
    const token = req.cookies?.token;
    if (!token) return res.status(401).json({ error: 'Unauthenticated' });
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    return res.json({ userId: payload.id });
  } catch {
    return res.status(401).json({ error: 'Invalid token' });
  }
});

// POST /api/auth/logout
router.post('/logout', (req, res) => {
  res.clearCookie('token', { httpOnly: true, secure: true, sameSite: 'None' });
  return res.json({ ok: true });
});

module.exports = router;
