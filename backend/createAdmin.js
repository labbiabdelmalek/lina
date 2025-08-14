// backend/createAdmin.js
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

// 👉 غادي نقراو من المتغيّرات باش مايبقاش شي سر فالكود
const EMAIL = process.env.ADMIN_EMAIL || 'admin@email.com';
const PASSWORD = process.env.ADMIN_PASSWORD || '123456';

(async () => {
  try {
    // Mongoose v8: بلا useNewUrlParser/useUnifiedTopology
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connecté à MongoDB');

    const hashedPwd = await bcrypt.hash(PASSWORD, 10);

    // ✅ upsert: إلا كان كاين يبدّل الموط باش، إلا ماكانش كينشئو
    await User.updateOne(
      { email: EMAIL },
      { $set: { email: EMAIL, motdepasse: hashedPwd } },
      { upsert: true }
    );

    console.log(`✅ Admin prêt: ${EMAIL} (créé/MAJ)`);
    await mongoose.connection.close();
    process.exit(0);
  } catch (err) {
    console.error('❌ Erreur:', err);
    process.exit(1);
  }
})();
