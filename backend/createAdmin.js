const mongoose = require('mongoose');
const User = require('./models/User');
const bcrypt = require('bcryptjs');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    const hashedPwd = await bcrypt.hash("admin123", 10);
    const user = new User({ email: "admin@email.com", motdepasse: hashedPwd });
    await user.save();
    console.log("✅ Admin créé");
    mongoose.disconnect();
  })
  .catch(err => console.error("❌", err));
