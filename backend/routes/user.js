const express = require ('express');

const router = express.Router();

const userCtrl = require('../controllers/user')

// Ce sont des requetes post car le F-e va envoyer des informations
router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login)

module.exports = router;
