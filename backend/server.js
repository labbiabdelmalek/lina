// backend/server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
require("dotenv").config();


const User = require("./models/User");

const app = express();


app.use('/setup', require('./routes/setup'));

// CORS
app.use(cors({
  origin: ['https://lina-wtb7.onrender.com', 'http://localhost:3000'],
  credentials: true
}));


app.use(express.json());
app.use("/uploads", express.static("uploads"));

// Healthcheck
app.get("/", (req, res) => res.send("API OK"));

// Connexion MongoDB (UTILISE UNIQUEMENT MONGODB_URI)
mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log("✅ Connecté à MongoDB");

    // --- Création d'un admin TEMPORAIRE, contrôlée par une variable d'env ---
    // Mets CREATE_ADMIN_ON_START=true dans Render > Environment (juste une fois)
    if (process.env.CREATE_ADMIN_ON_START === "true") {
      const email = "admin@email.com";
      const plain = "123456";

      const existe = await User.findOne({ email });
      if (!existe) {
        const hashedPwd = await bcrypt.hash(plain, 10);
        await User.create({ email, motdepasse: hashedPwd });
        console.log("✅ Admin créé avec succès:", email);
      } else {
        console.log("ℹ️ Admin déjà existant:", email);
      }
    }
    // ------------------------------------------------------------------------
  })
  .catch(err => console.error("❌ Erreur MongoDB :", err));

// Routes API
app.use("/api/articles", require("./routes/articles"));
app.use("/api/auth", require("./routes/auth"));

// Démarrage serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Serveur lancé sur port ${PORT}`));
