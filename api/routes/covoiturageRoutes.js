const express = require('express');
const router = express.Router();
const covoiturageController = require('../controllers/covoiturageController');

// Routes REST
router.get('/', covoiturageController.getAll);
router.get('/:id', covoiturageController.getById);
router.post('/', covoiturageController.create);
router.put('/:id', covoiturageController.update);
router.delete('/:id', covoiturageController.remove);

module.exports = router;
