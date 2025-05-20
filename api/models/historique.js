const mongoose = require('../config/mongoose'); // Chemin vers ton fichier de connexion

const CovoiturageHistoriqueSchema = new mongoose.Schema({
    passagerId: String,
    conducteurId: String,
    covoitId: String,
    passagerNom: String,
    passagerPrenom: String,
    passagerEmail: String,
    conducteurNom: String,
    conducteurPrenom: String,
    conducteurEmail: String,
    lieuDepart: String,
    dateDepart: String,
    heureDepart: String,
    dateArrivee: String,
    lieuArrivee: String,
    heureArrivee: String,
}, { timestamps: true });

const CovoiturageHistorique = mongoose.model('CovoiturageHistorique', CovoiturageHistoriqueSchema);

module.exports = CovoiturageHistorique;
