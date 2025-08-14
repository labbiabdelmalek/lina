require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs');
const path = require('path');
const fs = require('fs');

const User = require('./models/User');

const app = express();

/* ---------- Middlewares ---------- */
app.disable('x-powered-by');
app.use(cookieParser());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

/* ---------- CORS ---------- */
const envOrigins = (process.env.CORS_ORIGIN || process.env.ORIGIN || '')
  .split(',').map(s => s.trim()).filter(Boolean);

const allowedOrigins = [...new Set([
  ...envOrigins,
  'https://lina-wtb7.onrender.com',
  'http://localhost:5173',
  'http://localhost:3000'
])];

app.use(cors({
  origin: (origin, cb) => (!origin || allowedOrigins.includes(origin)) ? cb(null, true) : cb(new Error('Not allowed by CORS')),
  credentials: true,
  methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization','Accept','X-Requested-With']
}));
app.options('*', cors());

/* ---------- Upload dir (robuste + fallback) ---------- */
function ensureUploadDir() {
  const primary = process.env.UPLOAD_DIR || path.join(__dirname, 'uploads');
  try {
    if (fs.existsSync(primary)) {
      const st = fs.statSync(primary);
      if (!st.isDirectory()) throw new Error('UPLOAD_DIR exists and is not a directory');
    } else {
      fs.mkdirSync(primary, { recursive: true });
    }
    return primary;
  } catch {
    const tmp = '/tmp/uploads';
    if (!fs.existsSync(tmp)) fs.mkdirSync(tmp, { recursive: true });
    return tmp;
  }
}
const UPLOAD_DIR = ensureUploadDir();
process.env.UPLOAD_DIR = UPLOAD_DIR;
app.use('/uploads', express.static(UPLOAD_DIR));

/* ---------- Healthcheck ---------- */
app.get('/', (_req, res) => res.send('Lina Backend is Live 🎉'));

/* ---------- Routes ---------- */
app.use('/api/auth', require('./routes/auth'));
app.use('/api/articles', require('./routes/articles'));
app.use('/setup', require('./routes/setup'));

/* ---------- MongoDB ---------- */
mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('✅ Connecté à MongoDB');
    if (process.env.CREATE_ADMIN_ON_START === 'true') {
      const email = process.env.ADMIN_EMAIL || 'admin@email.com';
      const plain = process.env.ADMIN_PASSWORD || '123456';
      const exists = await User.findOne({ email });
      if (!exists) {
        const hash = await bcrypt.hash(plain, 10);
        await User.create({ email, motdepasse: hash });
        console.log('✅ Admin créé:', email);
      } else {
        console.log('ℹ️ Admin déjà existant:', email);
      }
    }
  })
  .catch(err => console.error('❌ Erreur MongoDB:', err.message));

/* ---------- Start ---------- */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 API on port ${PORT}`));
