const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// CORS (en test: *, en prod: ton domaine Vercel)
app.use(cors({
  origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : '*'
}));

app.use(express.json());

// Static (uploads)
app.use('/uploads', express.static('uploads'));

// Healthcheck
app.get("/", (req, res) => res.send("API OK"));

// MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("✅ Connecté à MongoDB");
    console.log("📂 Base utilisée :", mongoose.connection.name);
  })
  .catch((err) => console.error("❌ Erreur MongoDB :", err));

// Routes
app.use('/api/articles', require('./routes/articles'));
app.use('/api/auth', require('./routes/auth'));

// Start (Render fixe PORT)
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Serveur lancé sur port ${PORT}`));
