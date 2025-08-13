// backend/server.js
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser"); // ⬅️ مهم إذا كتستعمل كوكيز JWT
const bcrypt = require("bcryptjs");

const User = require("./models/User");

const app = express();

/* ---------- Middlewares عامّة ---------- */
app.use(cookieParser());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

/* ---------- CORS مضبوط ---------- */
const allowedOrigins = [
  "https://lina-wtb7.onrender.com", // Frontend على Render
  "http://localhost:5173",           // Vite dev
  "http://localhost:3000"            // CRA dev
];
app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
      return cb(new Error("Not allowed by CORS"));
    },
    credentials: true, // باش الكوكيز تمشي وتجي
  })
);
// preflight لطرق PUT/PATCH/DELETE
app.options("*", cors());

/* ---------- Static ---------- */
app.use("/uploads", express.static("uploads"));

/* ---------- Healthcheck ---------- */
app.get("/", (_req, res) => res.send("Lina Backend is Live 🎉"));

/* ---------- Routes (بعد الميدلويات) ---------- */
app.use("/setup", require("./routes/setup"));
app.use("/api/articles", require("./routes/articles"));
app.use("/api/auth", require("./routes/auth")); // انتَ كتستعمل /api/auth فالفْرونت

/* ---------- MongoDB ---------- */
mongoose
  .connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log("✅ Connecté à MongoDB");

    // إنشاء أدمن اختياري (طلّقها غير مرّة وحدة)
    if (process.env.CREATE_ADMIN_ON_START === "true") {
      const email = "admin@email.com";
      const plain = "123456";
      const existe = await User.findOne({ email });
      if (!existe) {
        const hashedPwd = await bcrypt.hash(plain, 10);
        await User.create({ email, motdepasse: hashedPwd });
        console.log("✅ Admin créé:", email);
      } else {
        console.log("ℹ️ Admin déjà existant:", email);
      }
    }
  })
  .catch((err) => console.error("❌ Erreur MongoDB:", err.message));

/* ---------- Start ---------- */
const PORT = process.env.PORT || 5000; // Render يعيّن PORT تلقائياً
app.listen(PORT, () => console.log(`🚀 API on port ${PORT}`));
