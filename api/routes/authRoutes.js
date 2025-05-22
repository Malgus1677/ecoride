const express = require('express');
const router = express.Router();
const authController = require('../controller/authController');
const upload = require("../middlewares/upload")



router.post('/register', upload.fields([
    { name: 'imageProfil', maxCount: 1 },
    { name: 'imagesVoiture', maxCount: 3 }
  ]), authController.register );
router.post('/login', authController.login );
router.get('/me', authController.me)
router.post('checkmail/:email', authController.checkMail)
router.post('/pseudo/:pseudo', authController.checkPseudo)



module.exports = router;
