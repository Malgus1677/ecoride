const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectMongo = require('./config/mongoose');
const mysql = require('./config/mysql'); // initialise la connexion
const covoiturageRoutes = require('./routes/covoiturageRoutes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());               
app.use(express.json());

// Route test
app.get('/', (req, res) => {
  res.send('🚗 Bienvenue sur l\'API Ecoride');
});

// Routes API
app.use('/api/covoiturages', covoiturageRoutes);

// Connexion MongoDB
connectMongo();

// Lancement serveur
app.listen(PORT, () => {
  console.log(`🚀 Serveur lancé sur http://localhost:${PORT}`);
});
