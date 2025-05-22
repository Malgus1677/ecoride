const express = require('express');
const router = express.Router();
const covoiturageController = require('../controller/CovoiturageController');

// Routes REST

router.get('/:id', covoiturageController.getCovoitById);
router.post('/user/:id', covoiturageController.getCovoitByUser);


module.exports = router;
