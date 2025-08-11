// backend/server.js (version TEST sans DB)
const express = require("express");
const cors = require("cors");

const app = express();

// CORS large pour tester (on resserrera après)
app.use(cors({ origin: "*" }));
app.use(express.json());

// Santé
app.get("/", (req, res) => res.send("Backend test OK 🚀"));

// Route de test API
app.get("/api/ping", (req, res) => res.json({ ok: true }));

// Route articles de test (sans DB)
app.get("/api/articles", (req, res) => {
  res.json([{ _id: "1", titre: "Article test", contenu: "Ceci est un test." }]);
});

// Render fournit PORT
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("✅ Listening on", PORT));
