const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();

const app = express();

// ✅ CORS: autorise ton frontend (ou * pendant les tests)
app.use(cors({
  origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : '*',
  credentials: true
}));

// Parsers
app.use(bodyParser.json());
// ou simplement: app.use(express.json());

// 📦 Static (uploads)
app.use('/uploads', express.static('uploads'));

// 🩺 Route de santé (utile sur Render)
app.get("/", (req, res) => {
  res.send("API OK");
});

// 🔌 Connexion MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("✅ Connecté à MongoDB");
    console.log("📂 Base utilisée :", mongoose.connection.name);
  })
  .catch((err) => console.error("❌ Erreur MongoDB :", err));

// 🛣️ Routes
const articlesRoutes = require('./routes/articles');
app.use('/api/articles', articlesRoutes);

const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

// 🚀 Démarrage serveur (Render fournit PORT)
const PORT = process.env.PORT || 5000;
app.get('/', (req, res) => res.send('API OK')); // pour éviter "Not Found"
app.listen(PORT, () => {
  console.log(`🚀 Serveur lancé sur port ${PORT}`);
});
