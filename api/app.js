const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectMongo = require('./config/mongoose');
const mysql = require('./config/mysql'); // initialise la connexion
const covoiturageRoutes = require('./routes/covoiturageRoutes');
const authRoutes = require('./routes/authRoutes')

const cookieParser = require('cookie-parser'); // <-- importer cookie-parser
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const corsOptions = {
  origin: 'http://localhost:3001', // Adresse exacte de ton frontend
  credentials: true,               // Autoriser l'envoi des cookies et headers d'authentification
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser()); // <-- ajouter ce middleware avant tes routes


// Routes API
app.use('/api/covoit', covoiturageRoutes);
app.use('/api/auth', authRoutes)

// Connexion MongoDB
connectMongo();

// Lancement serveur
app.listen(PORT, () => {
  console.log(`🚀 Serveur lancé sur http://localhost:${PORT}`);
});
