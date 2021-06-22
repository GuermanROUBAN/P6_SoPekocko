// Declaration du router
const express = require('express');
const router = express.Router();
//-----------------------------------------------------------------------------

// Importation des middleware
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');
//-----------------------------------------------------------------------------

// Importation du controller sauce
const sauceCtrl = require('../controllers/sauce');
//-----------------------------------------------------------------------------

// Enregistrement des sauces dans la base de donnée
router.post('/', auth, multer, sauceCtrl.creatSauce); 
// on met multer après l'authentification de la requete et pas avant

// Mise en place de la modification d'une sauce
router.put('/:id', auth, multer, sauceCtrl.modifySauce);

// Supprimer d'une sauce
router.delete('/:id', auth, sauceCtrl.deleteSauce);
  
// On Récupère une sauce spécifique
router.get('/:id', auth, sauceCtrl.getOneSauce)
  
// On va aller chercher la liste des sauces dans la BD
router.get('/', auth, sauceCtrl.getAllSauces);

// On ajoute les likes et dislikes des sauces
router.post('/:id/like', auth, sauceCtrl.likeSauce)

module.exports = router;