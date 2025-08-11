// createAdmin.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User'); // garde ce chemin si le fichier est dans backend/

// ⚠️ Tu peux changer ces 2 valeurs si tu veux
const EMAIL = 'admin@email.com';
const PASSWORD = '123456';

// Ton URI Atlas (celle que tu utilises sur Render)
const MONGODB_URI =
  'mongodb+srv://lina:linahouabdel2016@cluster0.kzinzje.mongodb.net/blogdb?retryWrites=true&w=majority&appName=Cluster0';

(async () => {
  try {
    await mongoose.connect(MONGODB_URI, {
      // ces options sont OK si tu utilises une version de mongoose < 7
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('✅ Connecté à MongoDB');

    // Évite les doublons
    const existing = await User.findOne({ email: EMAIL });
    if (existing) {
      console.log('ℹ️ Un utilisateur existe déjà avec cet email :', EMAIL);
      await mongoose.connection.close();
      process.exit(0);
    }

    const hashedPwd = await bcrypt.hash(PASSWORD, 10);

    await User.create({
      email: EMAIL,
      motdepasse: hashedPwd,
    });

    console.log('✅ Admin créé avec succès:', EMAIL);
    await mongoose.connection.close();
    process.exit(0);
  } catch (err) {
    console.error('❌ Erreur:', err);
    process.exit(1);
  }
})();
