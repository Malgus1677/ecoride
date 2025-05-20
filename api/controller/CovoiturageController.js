const db = require('../config/db');
const mongoose = require('mongoose');
const Historique = require('../models/historique'); // Ton modèle Mongoose

const ADMIN_ID = 6;

const getCovoiturageById = async (req, res) => {

}

// ✅ 1. Participer à un covoiturage
const participateCovoit = async (req, res) => {
    const { userId, covoitId, prixCo } = req.body;

    try {
        db.query("INSERT INTO participe (utilisateur_id, covoiturage_id) VALUES (?, ?)", [userId, covoitId], (error, result) => {
            if (error) return res.status(500).json({ message: "Erreur participation" });

            db.query("UPDATE covoiturage SET nb_place = nb_place - 1 WHERE covoiturage_id = ?", [covoitId], (error) => {
                if (error) return res.status(500).json({ message: "Erreur maj nb_place" });

                db.query("UPDATE utilisateur SET credits = credits - ? WHERE utilisateur_id = ?", [prixCo, userId], (error) => {
                    if (error) return res.status(500).json({ message: "Erreur maj crédits" });

                    res.status(200).json("Participation enregistrée");
                });
            });
        });
    } catch (error) {
        res.status(500).json({ error: "Erreur serveur" });
    }
};

// ✅ 2. Supprimer un covoiturage (conducteur)
const deleteCovoit = async (req, res) => {
    const covoitId = req.params.id;

    try {
        db.query(`
            SELECT p.utilisateur_id, c.prix_personne
            FROM participe p
            JOIN covoiturage c ON p.covoiturage_id = c.covoiturage_id
            WHERE p.covoiturage_id = ?
        `, [covoitId], async (error, participants) => {
            if (error) return res.status(500).json({ message: "Erreur récupération participants" });

            // Rembourse chaque participant (prix + 2 crédits)
            participants.forEach(({ utilisateur_id, prix_personne }) => {
                db.query("UPDATE utilisateur SET credits = credits + ? WHERE utilisateur_id = ?", [prix_personne + 2, utilisateur_id]);
            });

            // Récupère le propriétaire
            db.query(`
                SELECT v.utilisateur_id AS proprietaire_id
                FROM utilise u
                JOIN voiture v ON u.voiture_id = v.voiture_id
                WHERE u.covoiturage_id = ?
            `, [covoitId], async (error, results) => {
                if (error) return res.status(500).json({ message: "Erreur récupération propriétaire" });

                const proprietaireId = results[0]?.proprietaire_id;

                // Rembourse le conducteur (2 crédits pris par admin)
                if (proprietaireId) {
                    db.query("UPDATE utilisateur SET credits = credits + 2 WHERE utilisateur_id = ?", [proprietaireId]);
                }

                // Historique dans MongoDB
                await Historique.create({
                    type: 'suppression',
                    covoiturageId: covoitId,
                    conducteurId: proprietaireId || null,
                    participants,
                    date: new Date(),
                    adminAction: true
                });

                // Suppression des données MySQL
                db.query("DELETE FROM utilise WHERE covoiturage_id = ?", [covoitId]);
                db.query("DELETE FROM participe WHERE covoiturage_id = ?", [covoitId]);
                db.query("DELETE FROM covoiturage WHERE covoiturage_id = ?", [covoitId], () => {
                    res.status(200).json({ message: "Covoiturage supprimé et remboursements effectués" });
                });
            });
        });
    } catch (error) {
        res.status(500).json({ error: "Erreur serveur" });
    }
};

// ✅ 3. Annuler une participation (utilisateur)
const annulCovoit = async (req, res) => {
    const { userId, covoitId } = req.body;

    try {
        db.query(`
            SELECT c.prix_personne, v.utilisateur_id AS conducteur_id
            FROM covoiturage c
            JOIN utilise u ON c.covoiturage_id = u.covoiturage_id
            JOIN voiture v ON u.voiture_id = v.voiture_id
            WHERE c.covoiturage_id = ?
        `, [covoitId], async (error, result) => {
            if (error || !result.length) return res.status(500).json({ message: "Erreur récupération infos" });

            const { prix_personne, conducteur_id } = result[0];

            // Supprimer la participation
            db.query("DELETE FROM participe WHERE utilisateur_id = ? AND covoiturage_id = ?", [userId, covoitId]);

            // Incrémenter les places
            db.query("UPDATE covoiturage SET nb_place = nb_place + 1 WHERE covoiturage_id = ?", [covoitId]);

            // Rembourser l'utilisateur (prix + 2 crédits admin)
            db.query("UPDATE utilisateur SET credits = credits + ? WHERE utilisateur_id = ?", [prix_personne + 2, userId]);

            // Déduire du conducteur le prix
            db.query("UPDATE utilisateur SET credits = credits - ? WHERE utilisateur_id = ?", [prix_personne, conducteur_id]);

            // Historique MongoDB
            await Historique.create({
                type: 'annulation',
                covoiturageId: covoitId,
                utilisateurId: userId,
                conducteurId: conducteur_id,
                montantRembourse: prix_personne + 2,
                date: new Date()
            });

            res.status(200).json({ message: "Participation annulée et remboursements effectués" });
        });
    } catch (error) {
        res.status(500).json({ error: "Erreur serveur" });
    }
};

// ✅ 4. Récupérer les covoiturages d'un utilisateur
const getCovoitByUser = (req, res) => {
    const userId = req.params.id;

    db.query("SELECT * FROM participe WHERE utilisateur_id = ?", [userId], (error, results) => {
        if (error) return res.status(500).json({ message: "Erreur récupération participations" });

        if (!results.length) return res.status(200).json([]); // pas d'erreur, juste vide

        const ids = results.map(e => e.covoiturage_id);
        db.query("SELECT * FROM covoiturage WHERE covoiturage_id IN (?)", [ids], (error, covoiturages) => {
            if (error) return res.status(500).json({ message: "Erreur récupération covoiturages" });

            db.query("SELECT * FROM utilise WHERE covoiturage_id IN (?)", [ids], (error, vehicules) => {
                if (error) return res.status(500).json({ message: "Erreur récupération véhicules" });

                const result = covoiturages.map(covoit => {
                    const vehicule = vehicules.find(v => v.covoiturage_id === covoit.covoiturage_id);
                    return {
                        ...covoit,
                        voitureId: vehicule ? vehicule.voiture_id : null
                    };
                });

                res.status(200).json(result);
            });
        });
    });
};

module.exports = {
    participateCovoit,
    deleteCovoit,
    annulCovoit,
    getCovoitByUser
};
