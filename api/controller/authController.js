// controllers/authController.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const db = require('../config/mysql');
require('dotenv').config();


const register = async (req, res) => {
    try {
        const {
            userInfo,
            adresse,
            modele,
            couleur,
            immatriculation,
            energie,
            datePremiereImmatriculation,
            marque,
            selectedRole,
        } = req.body;

        const parsedUser = JSON.parse(userInfo);
        const hashedPassword = await bcrypt.hash(parsedUser.password, 10);

        // 1. Insertion utilisateur
        const [userResult] = await db.execute(
            'INSERT INTO utilisateur (nom, prenom, email, password, telephone, adresse, date_naissance, pseudo, credits, actif, photo) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 20, 1, ?)',
            [
                parsedUser.nom,
                parsedUser.prenom,
                parsedUser.email,
                hashedPassword,
                parsedUser.telephone,
                adresse,
                parsedUser.date_naissance,
                parsedUser.pseudo,
                req.files?.imageProfil?.[0]?.filename || null,
            ]
        );
        const utilisateurId = userResult.insertId;

        // 2. Insertion du rôle
        await db.execute(
            'INSERT INTO possede (utilisateur_id, role_id) VALUES (?, ?)',
            [utilisateurId, selectedRole]
        );

        // 3. Si chauffeur (role_id = 4), insérer voiture et images
        if (selectedRole === '4') {
            const [voitureResult] = await db.execute(
                'INSERT INTO voiture (modele, couleur, immatriculation, energie, date_premiere_immatriculation, marque) VALUES (?, ?, ?, ?, ?, ?)',
                [modele, couleur, immatriculation, energie, datePremiereImmatriculation, marque]
            );
            const voitureId = voitureResult.insertId;

            // Lier voiture à l'utilisateur
            await db.execute(
                'INSERT INTO gere (utilisateur_id, voiture_id) VALUES (?, ?)',
                [utilisateurId, voitureId]
            );

            // Sauvegarder les images voiture dans un dossier
            if (req.files?.imagesVoiture && req.files.imagesVoiture.length > 0) {
                for (const image of req.files.imagesVoiture) {
                    const tempPath = image.path;
                    const targetPath = path.join(__dirname, `../public/images/voitures/${image.filename}`);
                    fs.renameSync(tempPath, targetPath);
                }
            }
        }

        res.status(201).json({ message: 'Utilisateur enregistré avec succès' });
    } catch (error) {
        console.error('Erreur register :', error);
        res.status(500).json({ error: 'Erreur lors de l’enregistrement de l’utilisateur' });
    }
};


const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Récupérer utilisateur par email
        const [users] = await db.promise().query(
            'SELECT * FROM utilisateur WHERE email = ?',
            [email]
        );

        if (users.length === 0)
            return res.status(401).json({ error: 'Email ou mot de passe incorrect' });

        const user = users[0];

        // Vérifier mot de passe
        const match = await bcrypt.compare(password, user.password);
        if (!match)
            return res.status(401).json({ error: 'Email ou mot de passe incorrect' });

        // Récupérer les rôles de l'utilisateur via la table gere
        const [roles] = await db.promise().query(
            `SELECT role_id
       FROM possede
       WHERE utilisateur_id = ?
       LIMIT 1`,
            [user.utilisateur_id]
        );
        const roleId = roles.length > 0 ? roles[0].role_id : null;

        // Générer token JWT
        const token = jwt.sign({ id: user.utilisateur_id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        // Envoyer cookie avec token
        res.cookie('token', token, {
            httpOnly: true,
            secure: false,  // en prod true avec HTTPS
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        // Préparer données à renvoyer (user + roles)
        const userData = {
            user: {
                nom: user.nom,
                prenom: user.prenom,
                email: user.email,
                photo: user.photo,
                pseudo: user.pseudo,
                credits: user.credits,
                actif: user.actif,
                role: roleId
            }
        };

        return res.status(200).json(userData);

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erreur serveur lors du login' });
    }
};


const checkPseudo = async (req, res) => {
    const { pseudo } = req.query;

    try {
        const [result] = await db.promise().query('SELECT pseudo FROM utilisateur WHERE pseudo = ?', [pseudo]);
        res.json({ exists: result.length > 0 });
    } catch (err) {
        res.status(500).json({ error: 'Erreur serveur lors de la vérification du pseudo' });
    }
};

const checkMail = async (req, res) => {
    const { email } = req.query;

    try {
        const [result] = await db.promise().query('SELECT email FROM utilisateur WHERE email = ?', [email]);
        res.json({ exists: result.length > 0 });
    } catch (err) {
        res.status(500).json({ error: 'Erreur serveur lors de la vérification de l\'email' });
    }
};

const me = async (req, res) => {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ error: 'Non authentifié' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const [users] = await db.promise().query('SELECT utilisateur_id, nom, prenom, email, pseudo, photo, credits, adresse, telephone, date_naissance FROM utilisateur WHERE utilisateur_id = ?', [decoded.id]);

        if (users.length === 0) return res.status(404).json({ error: 'Utilisateur non trouvé' });

        res.json(users[0]);
    } catch (err) {
        res.status(401).json({ error: 'Token invalide' });
    }
};

module.exports = {
    register,
    login,
    me,
    checkMail,
    checkPseudo
}
