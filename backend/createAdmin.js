require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

const EMAIL = process.env.ADMIN_EMAIL || 'admin@email.com';
const PASSWORD = process.env.ADMIN_PASSWORD || '123456';

(async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const hash = await bcrypt.hash(PASSWORD, 10);
    await User.updateOne(
      { email: EMAIL },
      { $set: { email: EMAIL, motdepasse: hash } },
      { upsert: true }
    );
    console.log('✅ Admin créé/mis à jour :', EMAIL);
    await mongoose.connection.close();
    process.exit(0);
  } catch (e) {
    console.error('❌', e);
    process.exit(1);
  }
})();
