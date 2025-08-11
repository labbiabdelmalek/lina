// backend/createAdmin.js
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const path = require('path');

const User = require(path.join(__dirname, 'models', 'User.js')); // <-- à la racine de backend

async function main() {
  const email = process.argv[2] || 'admin@email.com';
  const password = process.argv[3] || 'admin123';

  if (!process.env.MONGODB_URI) {
    console.error('❌ MONGODB_URI manquant');
    process.exit(1);
  }

  await mongoose.connect(process.env.MONGODB_URI);
  console.log('✅ Connecté à MongoDB');

  const exists = await User.findOne({ email });
  if (exists) {
    console.log('ℹ️ Un utilisateur existe déjà avec cet email.');
    await mongoose.disconnect();
    process.exit(0);
  }

  const hashed = await bcrypt.hash(password, 10);
  await User.create({ email, password: hashed });

  console.log(`✅ Admin créé : ${email}`);
  await mongoose.disconnect();
  process.exit(0);
}

main().catch(async (e) => {
  console.error(e);
  await mongoose.disconnect();
  process.exit(1);
});
