const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Crée les dossiers si pas encore présents
const profilePath = path.join(__dirname, '../public/images/profils');
const voiturePath = path.join(__dirname, '../public/images/voitures');
fs.mkdirSync(profilePath, { recursive: true });
fs.mkdirSync(voiturePath, { recursive: true });

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (file.fieldname === 'imageProfil') {
      cb(null, profilePath);
    } else if (file.fieldname === 'imagesVoiture') {
      cb(null, voiturePath);
    } else {
      cb(new Error('Champ de fichier inconnu'), null);
    }
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + '-' + file.originalname.replace(/\s+/g, '');
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // limite 5 Mo
  fileFilter: function (req, file, cb) {
    const allowed = /jpeg|jpg|png|webp/;
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowed.test(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Seuls les fichiers jpeg, jpg, png ou webp sont autorisés.'));
    }
  }
});

module.exports = upload;
