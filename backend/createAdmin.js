const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User'); // adapte le chemin

mongoose.connect('mongodb+srv://<TON_URI>', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    const hashedPwd = await bcrypt.hash('123456', 10);
    const admin = new User({
      email: 'admin@email.com',
      motdepasse: hashedPwd
    });
    await admin.save();
    console.log('✅ Admin créé avec succès');
    mongoose.connection.close();
  })
  .catch(err => console.error(err));
